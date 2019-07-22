import { KeycloakAdmin } from './../core/keycloak/keycloak-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IamService {
  constructor(private readonly keycloakAdmin: KeycloakAdmin) {}

  async findAllUsers() {
    return this.keycloakAdmin.usersList();
  }
}
