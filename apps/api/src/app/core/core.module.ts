import { KeycloakAdmin } from './keycloak/keycloak-admin';
import { CloudApiFactory } from './cloudapi/cloudapi.factory';
import { OpenstackApiService } from './cloudapi/openstack.api.service';
import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Module({
  imports: [],
  controllers: [],
  providers: [OpenstackApiService, CloudApiFactory, KeycloakAdmin, ConfigService],
  exports: [OpenstackApiService, CloudApiFactory, KeycloakAdmin, ConfigService]
})
export class CoreModule {}
