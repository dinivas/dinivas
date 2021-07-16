import { GitService } from './git/git.service';
import { KeycloakAdmin } from './keycloak/keycloak-admin';
import { CloudApiFactory } from './cloudapi/cloudapi.factory';
import { OpenstackApiService } from './cloudapi/openstack.api.service';
import { DigitalOceanApiService } from './cloudapi/do/digitalocean.api.service';
import { Module } from '@nestjs/common';
import { ConfigurationService } from './config/configuration.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    OpenstackApiService,
    DigitalOceanApiService,
    CloudApiFactory,
    KeycloakAdmin,
    ConfigurationService,
    GitService
  ],
  exports: [
    OpenstackApiService,
    DigitalOceanApiService,
    CloudApiFactory,
    KeycloakAdmin,
    ConfigurationService
  ]
})
export class CoreModule {}
