import { computeTerraformJenkinsModuleVarsForDigitalocean } from './../digitalocean/index';
import { Logger } from '@nestjs/common';
import { ConfigurationService } from '../../configuration.service';
import {
  Base,
  ApplyOptions,
  OutputOptions,
  DestroyOptions,
  ExecuteOptions,
} from './base';
import {
  SimpleOutputObject,
  OutputObject,
  TerraformMultipleOutput,
  TerraformSingleOutput,
  SimpleOutput,
  Output,
  ResourceCounts,
  ChangeTypes,
} from './types';
import {
  TFPlanRepresentation,
  TFStateRepresentation,
  ProjectDTO,
  JenkinsDTO,
  ConsulDTO,
  RabbitMQDTO,
  InstanceDTO,
  PlanConsulCommand,
} from '@dinivas/api-interfaces';
import fs = require('fs');
import path = require('path');
import os = require('os');
import ncpModule = require('ncp');
import {
  addJenkinsSlaveFilesToModuleForDigitalocean,
  computeTerraformProjectBaseModuleVarsForDigitalocean,
} from '../digitalocean';
import {
  addJenkinsSlaveFilesToModuleForOpenstack,
  computeTerraformJenkinsModuleVarsForOpenstack,
  computeTerraformProjectBaseModuleVarsForOpenstack,
} from '../openstack';
const ncp = ncpModule.ncp;

export class Terraform extends Base {
  private readonly nestLogger = new Logger(Terraform.name);
  constructor(private configService: ConfigurationService) {
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
    await this.executeSync(path, commandToExecute, {
      silent: options.silent,
    });
  }

  public async output(
    path: string,
    options: OutputOptions = {}
  ): Promise<SimpleOutputObject | OutputObject> {
    const parsedOptions = this.parseOutputOptions(options);
    const { stdout } = await this.executeSync(path, 'output -json', {
      silent: parsedOptions.silent,
    });
    const output = <TerraformMultipleOutput>JSON.parse(stdout);
    if (options.simple) {
      const keys = Object.keys(output);
      const result = {};
      keys.forEach((key) => {
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
      silent: parsedOptions.silent,
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
      silent: options.silent || true,
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
      silent: options.silent || false,
    });
    const { stdout } = await this.executeSync(path, `show -json last-plan`, {
      silent: true,
    });
    return JSON.parse(stdout) as TFPlanRepresentation;
    //return this.parseResourceChanges(stdout, ChangeTypes.PLAN);
  }

  public async destroy(
    path: string,
    commandLineArgs: string[],
    options: DestroyOptions = {}
  ) {
    const commandToExecute = `destroy ${commandLineArgs.join(' ')}`;
    this.nestLogger.debug(commandToExecute);
    await this.executeSync(path, commandToExecute, {
      silent: options.silent || false,
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
      silent: options.silent || false,
    });
    // Terraform show state as json
    const { stdout } = await this.executeSync(path, `show -json`, {
      silent: true,
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
        destroyCount: 0,
      };
    }
    let regexp = / /;
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
      // eslint-disable-next-line no-control-regex
      /\u001b\[.*?m/g,
      ''
    );
    const matches = regexp.exec(resourcesChangesWithoutStyles);

    if (matches) {
      if (command === ChangeTypes.DESTROYED) {
        return {
          addCount: 0,
          changeCount: 0,
          destroyCount: parseInt(matches[1], 10),
        };
      }
      return {
        addCount: parseInt(matches[1], 10),
        changeCount: parseInt(matches[2], 10),
        destroyCount: parseInt(matches[3], 10),
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
      required_version = ">= ${this.configService.get(
        'terraform.min_required_version'
      )}"
      backend "http" {
        address        = "${this.configService.get(
          'terraform.state.http_address'
        )}?stateId=${stateId.toLowerCase()}&module=${module}"
        lock_address   = "${this.configService.get(
          'terraform.state.http_address'
        )}?stateId=${stateId.toLowerCase()}&module=${module}"
        unlock_address = "${this.configService.get(
          'terraform.state.http_address'
        )}?stateId=${stateId.toLowerCase()}&module=${module}"
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

  addProviderConfigFileToModule(
    cloudprovider: string,
    cloudConfig: any,
    destination: string
  ) {
    let providerContent;
    if ('openstack' === cloudprovider) {
      providerContent = `
    provider "openstack" {
      user_name   = "${cloudConfig.clouds.openstack.auth.username}"
      tenant_name = "${cloudConfig.clouds.openstack.auth.project_name}"
      password    = "${cloudConfig.clouds.openstack.auth.password}"
      auth_url    = "${cloudConfig.clouds.openstack.auth.auth_url}"
      region      = "${cloudConfig.clouds.openstack.region_name}"
    }
    `;
    }
    if ('digitalocean' === cloudprovider) {
      providerContent = `
      provider "digitalocean" {
        token = "${cloudConfig.access_token}"
      }
    `;
    }
    try {
      fs.writeFileSync(path.join(destination, 'provider.tf'), providerContent);
    } catch (err) {
      this.nestLogger.error(err);
    }
  }

  addKeycloakProviderConfigFileToModule(
    project: ProjectDTO,
    destination: string
  ) {
    const providerContent = `
    provider "keycloak" {
      client_id   = "${project.keycloak_client_id}"
      client_secret = "${project.keycloak_client_secret}"
      url    = "http://${project.keycloak_host}"
    }
    `;
    try {
      fs.writeFileSync(
        path.join(destination, 'keycloak-provider.tf'),
        providerContent
      );
    } catch (err) {
      this.nestLogger.error(err);
    }
  }

  executeInTerraformModuleDir(
    projectCode: string,
    cloudProviderId: string,
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
            cloudProviderId,
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
            this.addProviderConfigFileToModule(
              cloudProviderId,
              cloudConfig,
              tempFolder
            );
            if (preInitCallback) preInitCallback(tempFolder);
            // Init module temporary directory
            try {
              await this.init(tempFolder, [], {
                silent: this.configService.getOrElse(
                  'terraform.init.log_silent',
                  false
                ),
              });
              if (postInitCallback) postInitCallback(tempFolder);
            } catch (error) {
              if (onInitErrorCallback) onInitErrorCallback(error);
            }
          }
        );
      }
    );
  }

  computeTerraformProjectBaseModuleVars(
    project: ProjectDTO,
    projectConsul: ConsulDTO,
    cloudConfig: any
  ): string[] {
    if ('openstack' === project.cloud_provider.cloud) {
      return computeTerraformProjectBaseModuleVarsForOpenstack(
        project,
        projectConsul,
        cloudConfig
      );
    }
    if ('digitalocean' === project.cloud_provider.cloud) {
      return computeTerraformProjectBaseModuleVarsForDigitalocean(
        project,
        projectConsul,
        cloudConfig
      );
    }
  }

  addJenkinsSlaveFilesToModule(
    jenkinsDTO: JenkinsDTO,
    projectConsul: ConsulDTO,
    cloudConfig: any,
    destination: string
  ) {
    if ('openstack' === jenkinsDTO.project.cloud_provider.cloud) {
      addJenkinsSlaveFilesToModuleForOpenstack(
        jenkinsDTO,
        projectConsul,
        cloudConfig,
        destination
      );
    }
    if ('digitalocean' === jenkinsDTO.project.cloud_provider.cloud) {
      addJenkinsSlaveFilesToModuleForDigitalocean(
        jenkinsDTO,
        projectConsul,
        cloudConfig,
        destination
      );
    }
  }

  addSshViaBastionConfigFileToModule(projectState: any, destination: string) {
    const content = `
    ssh_via_bastion_config = {
      "host_private_key"     = <<EOT
      ${projectState.outputs.project_private_key.value}
      EOT
      "bastion_host"         = "${projectState.outputs.bastion_floating_ip.value}"
      "bastion_private_key"  = <<EOT
      ${projectState.outputs.bastion_private_key.value}
      EOT
    }
    `;
    try {
      fs.writeFileSync(
        path.join(destination, 'ssh-via-bastion.tfvars'),
        content
      );
    } catch (err) {
      this.nestLogger.error(err);
    }
  }

  computeTerraformJenkinsModuleVars(
    jenkins: JenkinsDTO,
    consul: ConsulDTO,
    cloudConfig: any
  ): string[] {
    if ('openstack' === jenkins.project.cloud_provider.cloud) {
      return computeTerraformJenkinsModuleVarsForOpenstack(
        jenkins,
        consul,
        cloudConfig
      );
    }
    if ('digitalocean' === jenkins.project.cloud_provider.cloud) {
      return computeTerraformJenkinsModuleVarsForDigitalocean(
        jenkins,
        consul,
        cloudConfig
      );
    }
  }

  computeTerraformRabbitMQModuleVars(
    rabbitmq: RabbitMQDTO,
    consul: ConsulDTO,
    cloudConfig: any
  ): string[] {
    const onDestroyCommand = 'consul leave';
    const rabbitmq_cluster_vars = [
      `-var 'project_name=${rabbitmq.project.code.toLowerCase()}'`,
      `-var 'enable_rabbitmq=1'`,
      `-var 'rabbitmq_cluster_name=${rabbitmq.code.toLowerCase()}'`,
      `-var 'rabbitmq_nodes_count=${rabbitmq.cluster_instance_count}'`,
      `-var 'rabbitmq_cluster_availability_zone=${rabbitmq.project.availability_zone}'`,
      `-var 'rabbitmq_cluster_image_name=${rabbitmq.cluster_cloud_image}'`,
      `-var 'rabbitmq_cluster_compute_flavor_name=${rabbitmq.cluster_cloud_flavor}'`,
      `-var 'rabbitmq_cluster_keypair_name=${rabbitmq.keypair_name}'`,
      `-var 'rabbitmq_cluster_security_groups_to_associate=["${rabbitmq.project.code.toLowerCase()}-common"]'`,
      `-var 'rabbitmq_cluster_network=${rabbitmq.network_name}'`,
      `-var 'rabbitmq_cluster_subnet=${rabbitmq.network_subnet_name}'`,
      `-var 'rabbitmq_plugin_list=${rabbitmq.enabled_plugin_list}'`,
      `-var 'project_consul_domain=${consul.cluster_domain}'`,
      `-var 'project_consul_datacenter=${consul.cluster_datacenter}'`,
      `-var 'os_auth_domain_name=${cloudConfig.clouds.openstack.auth.user_domain_name}'`,
      `-var 'execute_on_destroy_rabbitmq_node_script=${onDestroyCommand}'`,
      `-var 'os_auth_username=${cloudConfig.clouds.openstack.auth.username}'`,
      `-var 'os_auth_password=${cloudConfig.clouds.openstack.auth.password}'`,
      `-var 'os_auth_url=${cloudConfig.clouds.openstack.auth.auth_url}'`,
      `-var 'os_project_id=${cloudConfig.clouds.openstack.auth.project_id}'`,
      `-var-file=ssh-via-bastion.tfvars`,
    ];
    return rabbitmq_cluster_vars;
  }

  computeTerraformInstanceModuleVars(
    instance: InstanceDTO,
    consul: ConsulDTO,
    cloudConfig: any
  ): string[] {
    const onDestroyCommand = 'consul leave';
    const instance_vars = [
      `-var 'project_name=${instance.project.code.toLowerCase()}'`,
      `-var 'instance_name=${instance.code.toLowerCase()}'`,
      `-var 'enable_instance=1'`,
      `-var 'instance_count=1'`,
      `-var 'instance_image_name=${instance.cloud_image}'`,
      `-var 'instance_flavor_name=${instance.cloud_flavor}'`,
      `-var 'instance_keypair_name=${instance.keypair_name}'`,
      `-var 'instance_network=${instance.network_name}'`,
      `-var 'instance_subnet=${instance.network_subnet_name}'`,
      `-var 'instance_availability_zone=${instance.project.availability_zone}'`,
      `-var 'instance_security_groups_to_associate=["${instance.project.code.toLowerCase()}-common"]'`,
      `-var 'project_consul_domain=${consul.cluster_domain}'`,
      `-var 'project_consul_datacenter=${consul.cluster_datacenter}'`,
      `-var 'os_auth_domain_name=${cloudConfig.clouds.openstack.auth.user_domain_name}'`,
      `-var 'execute_on_destroy_instance_script=${onDestroyCommand}'`,
      `-var 'os_auth_username=${cloudConfig.clouds.openstack.auth.username}'`,
      `-var 'os_auth_password=${cloudConfig.clouds.openstack.auth.password}'`,
      `-var 'os_auth_url=${cloudConfig.clouds.openstack.auth.auth_url}'`,
      `-var 'os_project_id=${cloudConfig.clouds.openstack.auth.project_id}'`,
      `-var-file=ssh-via-bastion.tfvars`,
    ];
    return instance_vars;
  }

  computeTerraformConsulModuleVars(consulCommand: PlanConsulCommand): string[] {
    const consul_cluster_vars = [
      `-var 'enable_consul_cluster=1'`,
      `-var 'consul_cluster_name=${consulCommand.consul.code.toLowerCase()}'`,
      `-var 'consul_cluster_domain=${consulCommand.consul.cluster_domain}'`,
      `-var 'consul_cluster_datacenter=${consulCommand.consul.cluster_datacenter}'`,
      `-var 'consul_cluster_availability_zone=${consulCommand.consul.project.availability_zone}'`,
      `-var 'consul_server_image_name=${consulCommand.consul.server_image}'`,
      `-var 'consul_server_flavor_name=${consulCommand.consul.server_flavor}'`,
      `-var 'consul_client_image_name=${consulCommand.consul.client_image}'`,
      `-var 'consul_client_flavor_name=${consulCommand.consul.client_flavor}'`,
      `-var 'consul_server_instance_count=${consulCommand.consul.server_instance_count}'`,
      `-var 'consul_client_instance_count=${consulCommand.consul.client_instance_count}'`,
      `-var 'consul_server_keypair_name=${consulCommand.consul.keypair_name}'`,
      `-var 'consul_client_keypair_name=${consulCommand.consul.keypair_name}'`,
      `-var 'consul_cluster_security_groups_to_associate=["${consulCommand.consul.project.code.toLowerCase()}-common"]'`,
      `-var 'consul_cluster_network=${consulCommand.consul.network_name}'`,
      `-var 'consul_cluster_metadata={"consul_cluster_name":"${consulCommand.consul.code.toLowerCase()}"}'`,
      `-var 'consul_cluster_subnet=${consulCommand.consul.network_subnet_name}'`,
      consulCommand.consul.use_floating_ip
        ? `-var 'consul_cluster_floating_ip_pool=${consulCommand.consul.project.floating_ip_pool}'`
        : '',
      `-var 'os_auth_domain_name=${consulCommand.cloudConfig.clouds.openstack.auth.user_domain_name}'`,
      `-var 'os_auth_username=${consulCommand.cloudConfig.clouds.openstack.auth.username}'`,
      `-var 'os_auth_password=${consulCommand.cloudConfig.clouds.openstack.auth.password}'`,
      `-var 'os_auth_url=${consulCommand.cloudConfig.clouds.openstack.auth.auth_url}'`,
      `-var 'os_project_id=${consulCommand.cloudConfig.clouds.openstack.auth.project_id}'`,
    ];
    return consul_cluster_vars;
  }
}
