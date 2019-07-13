import { Injectable, BadRequestException } from '@nestjs/common';
import { OpenstackApiService } from './openstack.api.service';
import { ICloudApi, ICloudApiConfig } from '@dinivas/dto';

import YAML from 'yaml';

@Injectable()
export class CloudApiFactory {
  constructor(private openstackApiService: OpenstackApiService) {}

  getCloudApiService(provider: string): ICloudApi {
    switch (provider) {
      case 'openstack':
        return this.openstackApiService;
      default:
        return this.openstackApiService;
    }
  }

  getCloudApiConfig(provider: string, config: any): ICloudApiConfig {
    switch (provider) {
      case 'openstack':
        const cloudConfig = YAML.parse(config).clouds;
        return {
          username: cloudConfig.openstack.auth.username,
          password: cloudConfig.openstack.auth.password,
          auth_url: cloudConfig.openstack.auth.auth_url,
          project_id: cloudConfig.openstack.auth.project_id
        } as ICloudApiConfig;
      default:
        throw new BadRequestException(
          `Cloud provider ${provider} is not implemented`
        );
    }
  }
}
