/* eslint-disable no-case-declarations */
import { Injectable, BadRequestException } from '@nestjs/common';
import { OpenstackApiService } from './openstack/openstack.api.service';
import { AWSApiService } from './aws/aws.api.service';
import { DigitalOceanApiService } from './do/digitalocean.api.service';
import { ICloudApi, ICloudApiConfig } from '@dinivas/api-interfaces';

import YAML = require('js-yaml');

@Injectable()
export class CloudApiFactory {
  constructor(
    private openstackApiService: OpenstackApiService,
    private digitalOceanApiService: DigitalOceanApiService,
    private awsApiService: AWSApiService
  ) {}

  getCloudApiService(provider: string): ICloudApi {
    switch (provider) {
      case 'openstack':
        return this.openstackApiService;
      case 'digitalocean':
        return this.digitalOceanApiService;
      case 'aws':
        return this.awsApiService;
      default:
        return this.openstackApiService;
    }
  }

  getCloudApiConfig(provider: string, config: any): ICloudApiConfig {
    switch (provider) {
      case 'openstack':
        const OSCloudConfig = YAML.load(config)['clouds'];
        return {
          username: OSCloudConfig.openstack.auth.username,
          password: OSCloudConfig.openstack.auth.password,
          auth_url: OSCloudConfig.openstack.auth.auth_url,
          project_id: OSCloudConfig.openstack.auth.project_id,
        } as ICloudApiConfig;
      case 'digitalocean':
        const DOCloudConfig = YAML.load(config);
        return {
          password: DOCloudConfig['access_token'],
          project_id: DOCloudConfig['project_id'],
        } as ICloudApiConfig;
      case 'aws':
        const awsCloudConfig = YAML.load(config);
        return {
          username: awsCloudConfig['access_key_id'],
          password: awsCloudConfig['secret_access_key'],
          region_name: awsCloudConfig['region'],
        } as ICloudApiConfig;
      default:
        throw new BadRequestException(
          `Cloud provider ${provider} is not implemented`
        );
    }
  }
}
