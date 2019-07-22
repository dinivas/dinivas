import { KeycloakAdmin } from './../core/keycloak/keycloak-admin';
import { Injectable } from '@nestjs/common';
import { UserRepresentation } from '@dinivas/dto';

@Injectable()
export class IamService {
  constructor(private readonly keycloakAdmin: KeycloakAdmin) {}

  async findAllUsers(): Promise<UserRepresentation[]> {
    return this.keycloakAdmin.usersList();
  }
}
