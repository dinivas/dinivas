import { API_PREFFIX } from './../../constants';
import { Logger } from '@nestjs/common';
import { ConfigService } from './../../core/config/config.service';
import {
  Base,
  ApplyOptions,
  OutputOptions,
  DestroyOptions,
  ExecuteOptions
} from './Base';
import {
  SimpleOutputObject,
  OutputObject,
  TerraformMultipleOutput,
  TerraformSingleOutput,
  SimpleOutput,
  Output,
  ResourceCounts,
  ChangeTypes
} from './Types';
import { TFPlanRepresentation } from '@dinivas/dto';
const fs = require('fs')
const path = require('path');

export class Terraform extends Base {

  private readonly nestLogger = new Logger(Terraform.name);
  constructor(private configService: ConfigService) {
    super('terraform', '-auto-approve');
    this.addTriggerWordForInteractiveMode(
      "Only 'yes' will be accepted to approve"
    );
    this.addTriggerWordForInteractiveMode(
      "Only 'yes' will be accepted to confirm"
    );
  }
  public async init(path: string, commandLineArgs: string[], options: ExecuteOptions = { silent: true }) {
    const commandToExecute = `init ${commandLineArgs.join(' ')}`;
    this.nestLogger.debug(commandToExecute);
    await this.executeSync(path, commandToExecute, { silent: options.silent });
  }

  public async output(
    path: string,
    options: OutputOptions = {}
  ): Promise<SimpleOutputObject | OutputObject> {
    const parsedOptions = this.parseOutputOptions(options);
    const { stdout } = await this.executeSync(path, 'output -json', {
      silent: parsedOptions.silent
    });
    const output = <TerraformMultipleOutput>JSON.parse(stdout);
    if (options.simple) {
      const keys = Object.keys(output);
      const result = {};
      keys.forEach(key => {
        result[key] = output[key].value;
      });
      return result;
    }
    return output;
  }

  public async outputValue(
    path: string,
    value: string,
    options: OutputOptions = {}
  ): Promise<SimpleOutput | Output> {
    const parsedOptions = this.parseOutputOptions(options);
    const { stdout } = await this.executeSync(path, `output -json ${value}`, {
      silent: parsedOptions.silent
    });
    const output = <TerraformSingleOutput>JSON.parse(stdout);
    if (parsedOptions.simple) {
      return output.value;
    }
    return output;
  }

  public async getOutputKeys(
    path: string,
    options: ExecuteOptions = {}
  ): Promise<string[]> {
    const { stdout } = await this.executeSync(path, 'output -json', {
      silent: options.silent || true
    });
    const output = JSON.parse(stdout);
    return Object.keys(output);
  }

  public async plan(
    path: string,
    commandLineArgs: string[],
    options: ExecuteOptions = {}
  ): Promise<TFPlanRepresentation> {
    const commandToExecute = `plan ${commandLineArgs.join(' ')}`;
    this.nestLogger.debug(commandToExecute);
    // First plan and save in file last-plan
    await this.executeSync(path, commandToExecute, {
      silent: options.silent || false
    });
    const { stdout } = await this.executeSync(path, `show -json last-plan`, {
      silent: options.silent || false
    });
    return JSON.parse(stdout) as TFPlanRepresentation;
    //return this.parseResourceChanges(stdout, ChangeTypes.PLAN);
  }

  public async destroy(
    path: string,
    options: DestroyOptions = {}
  ): Promise<ResourceCounts> {
    const { stdout } = await this.executeInteractive('destroy', path, options);
    return this.parseResourceChanges(stdout, ChangeTypes.DESTROYED);
  }

  public async apply(
    path: string,
    commandLineArgs: string[],
    options: ApplyOptions = {}
  ): Promise<ResourceCounts> {
    const commandToExecute = `apply ${commandLineArgs.join(' ')}`;
    this.nestLogger.debug(commandToExecute);
    const { stdout } = await this.executeInteractive(commandToExecute, path, options);
    return this.parseResourceChanges(stdout, ChangeTypes.ADDED);
  }

  private parseResourceChanges(
    rawStringWithResourceChanges: string,
    command: ChangeTypes
  ): ResourceCounts {
    if (rawStringWithResourceChanges.includes('No changes')) {
      return {
        addCount: 0,
        changeCount: 0,
        destroyCount: 0
      };
    }
    let regexp: RegExp = / /;
    switch (command) {
      case ChangeTypes.PLAN:
        regexp = new RegExp(
          'Plan: (\\d*) to add, (\\d*) to change, (\\d*) to destroy',
          'gi'
        );
        break;
      case ChangeTypes.ADDED:
        regexp = new RegExp(
          'Apply complete! Resources: (\\d*) added, (\\d*) changed, (\\d*) destroyed',
          'gi'
        );
        break;
      case ChangeTypes.DESTROYED:
        regexp = new RegExp('Destroy complete! Resources: (\\d) destroyed');
        break;
    }
    const resourcesChangesWithoutStyles = rawStringWithResourceChanges.replace(
      /\u001b\[.*?m/g,
      ''
    );
    const matches = regexp.exec(resourcesChangesWithoutStyles);

    if (matches) {
      if (command === ChangeTypes.DESTROYED) {
        return {
          addCount: 0,
          changeCount: 0,
          destroyCount: parseInt(matches[1], 10)
        };
      }
      return {
        addCount: parseInt(matches[1], 10),
        changeCount: parseInt(matches[2], 10),
        destroyCount: parseInt(matches[3], 10)
      };
    }
    throw new Error(
      `Could not extract added, changed and destroyed count with regexp ${regexp} from command ${rawStringWithResourceChanges}`
    );
  }

  addBackendConfigFileToModule(projectCode: string, module: string, destination: string) {
    const backendContent = `
    terraform {
      required_version = ">= 0.12.2"
      backend "http" {
        address        = "http://localhost:${process.env.PORT || 3333}/${API_PREFFIX}/terraform/state?projectCode=${projectCode}&module=${module}"
        lock_address   = "http://localhost:${process.env.PORT || 3333}/${API_PREFFIX}/terraform/state?projectCode=${projectCode}&module=${module}"
        unlock_address = "http://localhost:${process.env.PORT || 3333}/${API_PREFFIX}/terraform/state?projectCode=${projectCode}&module=${module}"
        username       = "${this.configService.get('terraform.state.username')}"
        password       = "${this.configService.get('terraform.state.password')}"
      }
    }
    `;
    try {
      fs.writeFileSync(path.join(destination, 'backend.tf'), backendContent);
    } catch (err) {
      console.error(err)
    }
  }

  addProviderConfigFileToModule(cloudConfig: any, destination: string) {
    const providerContent = `
    provider "openstack" {
      user_name   = "${cloudConfig.clouds.openstack.auth.username}"
      tenant_name = "${cloudConfig.clouds.openstack.auth.project_name}"
      password    = "${cloudConfig.clouds.openstack.auth.password}"
      auth_url    = "${cloudConfig.clouds.openstack.auth.auth_url}"
      region      = "${cloudConfig.clouds.openstack.region_name}"
    }
    `;
    try {
      fs.writeFileSync(path.join(destination, 'provider.tf'), providerContent);
    } catch (err) {
      this.nestLogger.error(err)
    }
  }
}
