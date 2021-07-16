import { ConfigurationService } from './../config/configuration.service';
import { Injectable } from '@nestjs/common';
import * as adminClient from 'keycloak-admin-client';
import * as getToken from 'keycloak-request-token';
import * as request from 'request-promise-native';

@Injectable()
export class KeycloakAdmin {
  config: any;
  request: KeyCloakAdminRequest;
  constructor(private configService: ConfigurationService) {
    this.config = this.createAdminClientConfig();
    this.request = new KeyCloakAdminRequest(this.config);
  }

  createAdminClientConfig() {
    return {
      realm: this.configService.getKeycloakConfig().realm,
      baseUrl: this.configService.getKeycloakConfig()['auth-server-url'],
      resource: this.configService.getKeycloakConfig().resource,
      username: this.configService.get('keycloak.admin.username'),
      password: this.configService.get('keycloak.admin.password'),
      grant_type: 'password',
      client_id: 'admin-cli'
    };
  }

  realmsList() {
    return adminClient(this.config).then(client => client.realms.find());
  }

  usersList() {
    return adminClient(this.config).then(client =>
      client.users.find(this.config.realm)
    );
  }

  createTestUser() {
    return adminClient(this.config).then(client =>
      createTestUser(client, this.config.realm).then(newUser =>
        resetUserPassword(client, this.config.realm, newUser).then(
          () => newUser
        )
      )
    );
  }

  updateTestUser() {
    return adminClient(this.config).then(client =>
      this.findTestUser().then(user => {
        user.firstName = 'user first name updated';
        return client.users
          .update(this.config.realm, user)
          .then(() => 'user updated');
      })
    );
  }

  findUserById(userId: string) {
    return adminClient(this.config)
      .then(client =>
        client.users.find(this.config.realm, {
          id: userId
        })
      )
      .then(users => {
        const user = users && users[0];
        return user && user.id
          ? Promise.resolve(user)
          : Promise.reject('user not found');
      });
  }

  findTestUser() {
    return adminClient(this.config)
      .then(client =>
        client.users.find(this.config.realm, {
          username: 'test_user'
        })
      )
      .then(users => {
        const user = users && users[0];
        return user && user.id
          ? Promise.resolve(user)
          : Promise.reject('user not found');
      });
  }

  setTestUserCustomerId() {
    return adminClient(this.config).then(client =>
      this.findTestUser().then(user => {
        user.attributes = user.attributes || {};
        user.attributes.customerId = 123;
        return client.users
          .update(this.config.realm, user)
          .then(() => 'customerId added');
      })
    );
  }

  removeTestUserCustomerId() {
    return adminClient(this.config).then(client =>
      this.findTestUser().then(user => {
        user.attributes = user.attributes || {};
        user.attributes.customerId = undefined;
        return client.users
          .update(this.config.realm, user)
          .then(() => 'customerId removed');
      })
    );
  }

  // this is an example how to get user by id
  getUserById() {
    return adminClient(this.config).then(client =>
      this.findTestUser().then(user =>
        client.users.find(this.config.realm, {
          userId: user.id
        })
      )
    );
  }

  deleteTestUser() {
    return adminClient(this.config)
      .then(client => this.findTestUser())
      .then(user => this.deleteUserById(user.id));
  }

  deleteUserById(userId) {
    return adminClient(this.config)
      .then(client => client.users.remove(this.config.realm, userId))
      .then(() => 'user deleted');
  }

  // admin client doesn't have these methods

  createRole() {
    return this.authenticate()
      .then(token => this.request.createRole('TEST_ROLE', token))
      .then(() => 'role created');
  }

  deleteRole() {
    return this.authenticate()
      .then(token => this.request.deleteRole('TEST_ROLE', token))
      .then(() => 'TEST_ROLE role is deleted');
  }

  addTestRoleToTestUser() {
    return this.findTestUser().then(user =>
      this.authenticate()
        .then(token =>
          this.getRoleByName('TEST_ROLE').then(role =>
            this.request.addRole(user.id, role, token)
          )
        )
        .then(() => 'TEST_ROLE role is added to the user login=test_user')
    );
  }

  removeTestRoleFromTestUser() {
    return this.findTestUser().then(user =>
      this.authenticate()
        .then(token =>
          this.getRoleByName('TEST_ROLE').then(role =>
            this.request.removeRoleFromUser(user.id, role, token)
          )
        )
        .then(() => 'TEST_ROLE role is removed from user')
    );
  }

  getRoleByName(roleName) {
    return this.authenticate()
      .then(token => this.request.getRole(roleName, token))
      .then(role =>
        role ? Promise.resolve(role) : Promise.reject('role not found')
      );
  }

  authenticate() {
    return getToken(this.config.baseUrl, this.config);
  }
}

function createTestUser(client, realm) {
  return client.users.create(realm, {
    username: 'test_user',
    firstName: 'user first name',
    enabled: true
  });
}

function resetUserPassword(client, realm, user) {
  // set password 'test_user' for a user
  return client.users.resetPassword(realm, user.id, {
    type: 'password',
    value: 'test_user'
  });
}

export class KeyCloakAdminRequest {
  config: any;
  constructor(config) {
    this.config = config;
  }

  addRole(userId, role, token) {
    return this.doRequest(
      'POST',
      `/admin/realms/${this.config.realm}/users/${userId}/role-mappings/realm`,
      token,
      [role]
    );
  }

  createRole(roleName, token) {
    return this.doRequest(
      'POST',
      `/admin/realms/${this.config.realm}/roles`,
      token,
      {
        name: roleName
      }
    );
  }

  deleteRole(roleName, token) {
    return this.doRequest(
      'DELETE',
      `/admin/realms/${this.config.realm}/roles/${roleName}`,
      token
    );
  }

  getRole(roleName, token) {
    return this.doRequest(
      'GET',
      `/admin/realms/${this.config.realm}/roles/${roleName}`,
      token,
      null
    );
  }

  removeRoleFromUser(userId, role, token) {
    return this.doRequest(
      'DELETE',
      `/admin/realms/${this.config.realm}/users/${userId}/role-mappings/realm`,
      token,
      [role]
    );
  }

  doRequest(method, url, accessToken, jsonBody?) {
    const options: any = {
      url: this.config.baseUrl + url,
      auth: {
        bearer: accessToken
      },
      method: method,
      json: true
    };

    if (jsonBody !== null) {
      options.body = jsonBody;
    }

    return request(options).catch(error =>
      Promise.reject(error.message ? error.message : error)
    );
  }
}
