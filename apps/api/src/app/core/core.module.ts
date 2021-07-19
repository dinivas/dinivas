import { KeycloakAdmin } from './keycloak/keycloak-admin';
import { CloudApiFactory } from './cloudapi/cloudapi.factory';
import { OpenstackApiService } from './cloudapi/openstack.api.service';
import { DigitalOceanApiService } from './cloudapi/do/digitalocean.api.service';
import { Module } from '@nestjs/common';
import { ConfigurationService } from './config/configuration.service';
import { CoreWebSocketGateway } from '../core/core-websocket.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [
    OpenstackApiService,
    DigitalOceanApiService,
    CloudApiFactory,
    KeycloakAdmin,
    ConfigurationService,
    CoreWebSocketGateway
  ],
  exports: [
    OpenstackApiService,
    DigitalOceanApiService,
    CloudApiFactory,
    KeycloakAdmin,
    ConfigurationService,
    CoreWebSocketGateway
  ],
})
export class CoreModule {}
