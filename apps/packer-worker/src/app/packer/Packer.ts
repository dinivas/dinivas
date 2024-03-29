/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-useless-catch */
import { Logger } from '@nestjs/common';
import { ModuleImageToBuildDTO } from '@dinivas/api-interfaces';
import { Base, ExecuteOptions } from './base';

import fs = require('fs');
import path = require('path');
import os = require('os');
import ncpModule = require('ncp');
import { ConfigurationService } from '../configuration.service';
const ncp = ncpModule.ncp;

export class Packer extends Base {
  private readonly nestLogger = new Logger(Packer.name);

  constructor(private configService: ConfigurationService) {
    super(configService.getPackerExecutable(), '-auto-approve');
  }
  executeInPackerModuleDir(
    imageModule: ModuleImageToBuildDTO,
    cloudConfig: any,
    doInsideWorkingDirCallback?: (
      workingFolder: string,
      varFileName: string
    ) => void,
    onInitErrorCallback?: (error) => void
  ) {
    fs.mkdtemp(
      path.join(os.tmpdir(), `packer-${imageModule.module_name}-`),
      (err: any, tempFolder: string) => {
        if (err) throw err;
        ncp(
          path.join(
            this.configService.getPackerModulesRootPath(),
            imageModule.module_name
          ),
          path.join(tempFolder),
          async (error: any) => {
            if (error) {
              return console.error(error);
            }
            this.nestLogger.debug(`Working Packer folder: ${tempFolder}`);
            // Add provider config
            const varFileName = this.addPackerVarFile(imageModule, tempFolder);
            try {
              if (doInsideWorkingDirCallback)
                doInsideWorkingDirCallback(tempFolder, varFileName);
            } catch (error) {
              if (onInitErrorCallback) onInitErrorCallback(error);
            }
          }
        );
      }
    );
  }

  addPackerVarFile(
    imageToBuild: ModuleImageToBuildDTO,
    destinationFolder: string
  ): string {
    const variables = {
      image_name: imageToBuild.image_name,
      ssh_user: imageToBuild.source_ssh_user,
      source_image_id: imageToBuild.source_cloud_image,
      source_image_name: imageToBuild.source_cloud_image,
      flavor: imageToBuild.source_cloud_flavor,
      network_id: imageToBuild.network,
      floating_ip_network: imageToBuild.floating_ip_network,
      region: imageToBuild.availability_zone,
    };
    const varFileName = `${imageToBuild.module_name}.json`;
    try {
      fs.writeFileSync(
        path.join(destinationFolder, varFileName),
        JSON.stringify(variables)
      );
    } catch (err) {
      this.nestLogger.error(err);
    }
    return varFileName;
  }

  public async build(
    cloudprovider: string,
    path: string,
    commandLineArgs: string[],
    options: ExecuteOptions = { silent: true },
    cloudConfig: any
  ) {
    const commandToExecute = `build ${commandLineArgs.join(' ')}`;
    this.nestLogger.debug(commandToExecute);
    try {
      const processEnv: {} = Object.assign({}, process.env);
      let cloudProviderEnvVars = undefined;
      switch (cloudprovider) {
        case 'openstack':
          cloudProviderEnvVars = {
            OS_USERNAME: cloudConfig.clouds.openstack.auth.username,
            OS_PROJECT_ID: cloudConfig.clouds.openstack.auth.project_id,
            OS_PROJECT_NAME: cloudConfig.clouds.openstack.auth.project_name,
            OS_PASSWORD: cloudConfig.clouds.openstack.auth.password,
            OS_AUTH_URL: cloudConfig.clouds.openstack.auth.auth_url,
            OS_REGION_NAME: cloudConfig.clouds.openstack.region_name,
            OS_USER_DOMAIN_NAME:
              cloudConfig.clouds.openstack.auth.user_domain_name,
            OS_IDENTITY_API_VERSION:
              cloudConfig.clouds.openstack.identity_api_version,
          };
          break;
        case 'digitalocean':
          cloudProviderEnvVars = {
            DIGITALOCEAN_API_TOKEN: cloudConfig.access_token,
          };
          break;

        default:
          break;
      }
      await this.executeSync(
        path,
        commandToExecute,
        {
          silent: options.silent,
        },
        {
          ...processEnv,
          ...cloudProviderEnvVars,
        }
      );
    } catch (e) {
      throw e;
    }
  }
}
