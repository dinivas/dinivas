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
import {
  TFPlanRepresentation,
  TFStateRepresentation,
  ProjectDTO,
  JenkinsDTO,
  JenkinsSlaveGroupDTO
} from '@dinivas/dto';
const fs = require('fs');
const path = require('path');
const os = require('os');
const ncp = require('ncp').ncp;

export class Terraform extends Base {
  private readonly nestLogger = new Logger(Terraform.name);
  constructor(private configService: ConfigService) {
    super(configService.getTerraformExecutable(), '-auto-approve');
    this.addTriggerWordForInteractiveMode(
      "Only 'yes' will be accepted to approve"
    );
    this.addTriggerWordForInteractiveMode(
      "Only 'yes' will be accepted to confirm"
    );
  }
  public async init(
    path: string,
    commandLineArgs: string[],
    options: ExecuteOptions = { silent: true }
  ) {
    const commandToExecute = `init ${commandLineArgs.join(' ')}`;
    this.nestLogger.debug(commandToExecute);
    try {
      await this.executeSync(path, commandToExecute, {
        silent: options.silent
      });
    } catch (e) {
      throw e;
    }
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
    try {
      await this.executeSync(path, commandToExecute, {
        silent: options.silent || false
      });
      const { stdout } = await this.executeSync(path, `show -json last-plan`, {
        silent: true
      });
      return JSON.parse(stdout) as TFPlanRepresentation;
    } catch (err) {
      throw err;
    }
    //return this.parseResourceChanges(stdout, ChangeTypes.PLAN);
  }

  public async destroy(
    path: string,
    commandLineArgs: string[],
    options: DestroyOptions = {}
  ) {
    const commandToExecute = `destroy ${commandLineArgs.join(' ')}`;
    this.nestLogger.debug(commandToExecute);
    const { stdout } = await this.executeSync(path, commandToExecute, {
      silent: options.silent || false
    });
    return;
  }

  public async apply(
    path: string,
    commandLineArgs: string[],
    options: ApplyOptions = {}
  ): Promise<TFStateRepresentation> {
    const commandToExecute = `apply ${commandLineArgs.join(' ')}`;
    this.nestLogger.debug(commandToExecute);

    // Terraform apply
    await this.executeSync(path, commandToExecute, {
      silent: options.silent || false
    });
    // Terraform show state as json
    const { stdout } = await this.executeSync(path, `show -json`, {
      silent: true
    });
    return JSON.parse(stdout) as TFStateRepresentation;
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

  addBackendConfigFileToModule(
    stateId: string,
    module: string,
    destination: string
  ) {
    const backendContent = `
    terraform {
      required_version = ">= 0.12.2"
      backend "http" {
        address        = "http://localhost:${process.env.PORT ||
          3333}/${API_PREFFIX}/terraform/state?stateId=${stateId.toLowerCase()}&module=${module}"
        lock_address   = "http://localhost:${process.env.PORT ||
          3333}/${API_PREFFIX}/terraform/state?stateId=${stateId.toLowerCase()}&module=${module}"
        unlock_address = "http://localhost:${process.env.PORT ||
          3333}/${API_PREFFIX}/terraform/state?stateId=${stateId.toLowerCase()}&module=${module}"
        username       = "${this.configService.get('terraform.state.username')}"
        password       = "${this.configService.get('terraform.state.password')}"
      }
    }
    `;
    try {
      fs.writeFileSync(path.join(destination, 'backend.tf'), backendContent);
    } catch (err) {
      console.error(err);
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
      this.nestLogger.error(err);
    }
  }

  executeInTerraformModuleDir(
    projectCode: string,
    tfModuleName: string,
    cloudConfig,
    preInitCallback?: (workingFolder: string) => void,
    postInitCallback?: (workingFolder: string) => void,
    onInitErrorCallback?: (error) => void
  ) {
    fs.mkdtemp(
      path.join(
        os.tmpdir(),
        `project-${projectCode.toLocaleLowerCase()}-${tfModuleName}-`
      ),
      (err: any, tempFolder: string) => {
        if (err) throw err;
        ncp(
          path.join(
            this.configService.getTerraformModulesRootPath(),
            tfModuleName
          ),
          path.join(tempFolder),
          async (error: any) => {
            if (error) {
              return console.error(error);
            }
            this.nestLogger.debug(`Working Terraform folder: ${tempFolder}`);
            // Add backend config file
            this.addBackendConfigFileToModule(
              projectCode,
              tfModuleName,
              tempFolder
            );
            // Add provider config
            this.addProviderConfigFileToModule(cloudConfig, tempFolder);
            if (preInitCallback) preInitCallback(tempFolder);
            // Init module temporary directory
            try {
              await this.init(tempFolder, [], { silent: false });
              if (postInitCallback) postInitCallback(tempFolder);
            } catch (error) {
              if (onInitErrorCallback) onInitErrorCallback(error);
            }
          }
        );
      }
    );
  }

  computeTerraformProjectBaseModuleVars(project: ProjectDTO): string[] {
    return [
      `-var 'project_name=${project.code.toLowerCase()}'`,
      `-var 'project_description=${project.description}'`,
      project.management_subnet_cidr
        ? `-var 'mgmt_subnet_cidr=${project.management_subnet_cidr}'`
        : '',
      `-var 'public_router_name=${project.public_router}'`,
      `-var 'bastion_image_name=${project.bastion_cloud_image}'`,
      `-var 'bastion_compute_flavor_name=${project.bastion_cloud_flavor}'`,
      `-var 'bastion_ssh_user=centos'`,
      `-var 'proxy_image_name=Dinivas Base Centos7'`,
      `-var 'enable_proxy=${project.enable_proxy ? '1' : '0'}'`,
      `-var 'proxy_compute_flavor_name=${
        project.proxy_cloud_flavor
          ? project.proxy_cloud_flavor
          : 'dinivas.medium'
      }'`,
      `-var 'prometheus_image_name=ShepherdCloud Prometheus'`,
      `-var 'prometheus_compute_flavor_name=${
        project.prometheus_cloud_flavor
      }'`,
      `-var 'enable_prometheus=${project.monitoring ? '1' : '0'}'`,
      `-var 'enable_logging_graylog=${
        project.logging && project.logging_stack == 'graylog' ? '1' : '0'
      }'`,
      `-var 'enable_logging_kibana=${
        project.logging && project.logging_stack == 'kibana' ? '1' : '0'
      }'`
    ];
  }

  addJenkinsSlaveFilesToModule(jenkinsDTO: JenkinsDTO, destination: string) {
    jenkinsDTO.slave_groups.forEach((slaveGroup: JenkinsSlaveGroupDTO) => {
      let slaveGroupFileContent = `
      module "jenkins-slave-${slaveGroup.code}" {
        source = "./slaves"

        jenkins_master_url = "${
          jenkinsDTO.use_existing_master
            ? jenkinsDTO.existing_master_url
            : jenkinsDTO.master_admin_url
        }"
        jenkins_master_username = "${
          jenkinsDTO.use_existing_master
            ? jenkinsDTO.existing_master_username
            : jenkinsDTO.master_admin_username
        }"
        jenkins_master_password = "${
          jenkinsDTO.use_existing_master
            ? jenkinsDTO.existing_master_password
            : jenkinsDTO.master_admin_password
        }"
        jenkins_slave_group_name = "${slaveGroup.code}"
        jenkins_slave_group_labels = "${slaveGroup.labels.join(',')}"
        jenkins_slave_group_instance_count = ${slaveGroup.instance_count}
        jenkins_slave_keypair = "${jenkinsDTO.project.code.toLowerCase()}"
        jenkins_slave_network = "${jenkinsDTO.project.code.toLowerCase()}-mgmt"
        jenkins_slave_group_cloud_image = "${slaveGroup.slave_cloud_image}"
        jenkins_slave_group_cloud_flavor   = "${slaveGroup.slave_cloud_flavor}"
      }

      `;
      try {
        fs.writeFileSync(
          path.join(destination, `slave_${slaveGroup.code}.tf`),
          slaveGroupFileContent
        );
      } catch (err) {
        console.error(err);
      }
    });
  }

  computeTerraformJenkinsModuleVars(jenkins: JenkinsDTO): string[] {
    const jenkins_master_vars = [
      `-var 'enable_jenkins_master=1'`,
      `-var 'jenkins_master_name=${jenkins.code.toLowerCase()}'`,
      `-var 'jenkins_master_instance_count=1'`,
      `-var 'jenkins_master_image_name=${jenkins.master_cloud_image}'`,
      `-var 'jenkins_master_compute_flavor_name=${
        jenkins.master_cloud_flavor
      }'`,
      `-var 'jenkins_master_keypair_name=${jenkins.keypair_name}'`,
      `-var 'jenkins_master_network=${jenkins.network_name}'`,
      `-var 'jenkins_master_subnet=${jenkins.network_subnet_name}'`,
      jenkins.use_floating_ip
        ? `-var 'jenkins_master_floating_ip_pool=${
            jenkins.project.floating_ip_pool
          }'`
        : ''
    ];
    return jenkins_master_vars;
  }
}
