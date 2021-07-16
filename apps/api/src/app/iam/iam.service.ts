import { ConfigurationService } from './../core/config/configuration.service';
import { Injectable } from '@nestjs/common';
import { UserRepresentation, ProjectDTO } from '@dinivas/api-interfaces';
import * as adminClient from 'keycloak-admin-client';

@Injectable()
export class IamService {
  constructor(private readonly configService: ConfigurationService) {
  }

  async findAllUsers(project: ProjectDTO): Promise<UserRepresentation[]> {
    const config = this.projectKeycloakConfig(project);
    return adminClient(config).then(client => client.users.find(config.realm));
  }

  async findOneUser(
    project: ProjectDTO,
    userId: string
  ): Promise<UserRepresentation> {
    const config = this.projectKeycloakConfig(project);
    return adminClient(config)
      .then(client =>
        client.users.find(config.realm, {
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

  projectKeycloakConfig(project: ProjectDTO): any {
    return {
      realm: project.code.toLowerCase(),
      baseUrl: this.configService.getKeycloakConfig()['auth-server-url'],
      resource: this.configService.getKeycloakConfig().resource,
      username: this.configService.get('keycloak.admin.username'),
      password: this.configService.get('keycloak.admin.password'),
      grant_type: 'password',
      client_id: 'admin-cli'
    };
  }
}
