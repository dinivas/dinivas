import { KeycloakAdmin } from './keycloak/keycloak-admin';
import { CloudApiFactory } from './cloudapi/cloudapi.factory';
import { OpenstackApiService } from './cloudapi/openstack.api.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [OpenstackApiService, CloudApiFactory, KeycloakAdmin],
  exports: [OpenstackApiService, CloudApiFactory, KeycloakAdmin]
})
export class CoreModule {}
