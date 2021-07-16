import { KeycloakAdmin } from '../core/keycloak/keycloak-admin';
import { Injectable } from '@nestjs/common';
import { UserRepresentation } from '@dinivas/api-interfaces';

@Injectable()
export class AdminIamService {
  constructor(private readonly keycloakAdmin: KeycloakAdmin) {}

  async findAllUsers(): Promise<UserRepresentation[]> {
    return this.keycloakAdmin.usersList();
  }

  async findOneUser(userId: string): Promise<UserRepresentation> {
    return this.keycloakAdmin.findUserById(userId);
  }
}
