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
  JenkinsSlaveGroupDTO,
  ConsulDTO,
  RabbitMQDTO,
  InstanceDTO,
  PlanConsulCommand,
} from '@dinivas/api-interfaces';
import fs = require('fs');
import path = require('path');
import os = require('os');
import ncpModule = require('ncp');
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
        address        = "${this.configService.get('terraform.state.http_address')}?stateId=${stateId.toLowerCase()}&module=${module}"
        lock_address   = "${this.configService.get('terraform.state.http_address')}?stateId=${stateId.toLowerCase()}&module=${module}"
        unlock_address = "${this.configService.get('terraform.state.http_address')}?stateId=${stateId.toLowerCase()}&module=${module}"
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
              await this.init(tempFolder, [], { silent: this.configService.getOrElse('terraform.init.log_silent', false) });
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
      return [
        `-var 'project_name=${project.code.toLowerCase()}'`,
        `-var 'project_root_domain=${project.root_domain}'`,
        `-var 'project_description=${project.description}'`,
        `-var 'project_availability_zone=${project.availability_zone}'`,
        project.management_subnet_cidr
          ? `-var 'mgmt_subnet_cidr=${project.management_subnet_cidr}'`
          : '',
        `-var 'mgmt_subnet_dhcp_allocation_start=${project.management_subnet_dhcp_allocation_start}'`,
        `-var 'mgmt_subnet_dhcp_allocation_end=${project.management_subnet_dhcp_allocation_end}'`,
        `-var 'public_router_name=${project.public_router}'`,
        `-var 'bastion_image_name=${project.bastion_cloud_image}'`,
        `-var 'bastion_compute_flavor_name=${project.bastion_cloud_flavor}'`,
        `-var 'bastion_ssh_user=centos'`,
        `-var 'proxy_image_name=${project.proxy_cloud_image}'`,
        `-var 'enable_proxy=${project.enable_proxy ? '1' : '0'}'`,
        `-var 'proxy_prefered_floating_ip=${
          project.proxy_prefered_floating_ip
            ? project.proxy_prefered_floating_ip
            : ''
        }'`,
        `-var 'project_keycloak_host=${project.keycloak_host}'`,
        `-var 'proxy_compute_flavor_name=${
          project.proxy_cloud_flavor
            ? project.proxy_cloud_flavor
            : 'dinivas.medium'
        }'`,
        `-var 'prometheus_image_name=ShepherdCloud Prometheus'`,
        `-var 'prometheus_compute_flavor_name=${project.prometheus_cloud_flavor}'`,
        `-var 'enable_prometheus=${project.monitoring ? '1' : '0'}'`,
        `-var 'enable_logging_graylog=${
          project.logging && project.logging_stack === 'graylog' ? '1' : '0'
        }'`,
        `-var 'enable_logging_kibana=${
          project.logging && project.logging_stack === 'kibana' ? '1' : '0'
        }'`,
        `-var 'graylog_compute_image_name=${
          project.graylog_compute_image_name
            ? project.graylog_compute_image_name
            : 'Dinivas Graylog AllInOne 2020-09-14'
        }'`,
        `-var 'graylog_compute_flavour_name=${
          project.graylog_compute_flavour_name
            ? project.graylog_compute_flavour_name
            : ''
        }'`,
        `-var 'project_consul_enable=1'`,
        `-var 'project_consul_domain=${projectConsul.cluster_domain}'`,
        `-var 'project_consul_datacenter=${
          projectConsul.cluster_datacenter
            ? projectConsul.cluster_datacenter
            : project.availability_zone
        }'`,
        `-var 'project_consul_server_count=${projectConsul.server_instance_count}'`,
        `-var 'project_consul_server_image_name=${projectConsul.server_image}'`,
        `-var 'project_consul_server_flavor_name=${projectConsul.server_flavor}'`,
        `-var 'project_consul_client_count=${projectConsul.client_instance_count}'`,
        `-var 'project_consul_client_image_name=${projectConsul.client_image}'`,
        `-var 'project_consul_client_flavor_name=${projectConsul.client_flavor}'`,
        `-var 'project_consul_floating_ip_pool=${
          projectConsul.use_floating_ip ? project.floating_ip_pool : ''
        }'`,
        `-var 'os_auth_domain_name=${cloudConfig.clouds.openstack.auth.user_domain_name}'`,
        `-var 'os_auth_username=${cloudConfig.clouds.openstack.auth.username}'`,
        `-var 'os_auth_password=${cloudConfig.clouds.openstack.auth.password}'`,
        `-var 'os_auth_url=${cloudConfig.clouds.openstack.auth.auth_url}'`,
        `-var 'os_project_id=${cloudConfig.clouds.openstack.auth.project_id}'`,
      ];
    }
    if ('digitalocean' === project.cloud_provider.cloud) {
      return [
        `-var 'project_name=${project.code.toLowerCase()}'`,
        `-var 'project_root_domain=${project.root_domain}'`,
        `-var 'project_description=${project.description}'`,
        `-var 'project_availability_zone=${project.availability_zone}'`,
        project.management_subnet_cidr
          ? `-var 'mgmt_subnet_cidr=${project.management_subnet_cidr}'`
          : '',
        `-var 'mgmt_subnet_dhcp_allocation_start=${project.management_subnet_dhcp_allocation_start}'`,
        `-var 'mgmt_subnet_dhcp_allocation_end=${project.management_subnet_dhcp_allocation_end}'`,
        `-var 'public_router_name=${project.public_router}'`,
        `-var 'bastion_image_name=${project.bastion_cloud_image}'`,
        `-var 'bastion_compute_flavor_name=${project.bastion_cloud_flavor}'`,
        `-var 'bastion_ssh_user=root'`,
        `-var 'proxy_image_name=${project.proxy_cloud_image}'`,
        `-var 'enable_proxy=${project.enable_proxy ? '1' : '0'}'`,
        `-var 'proxy_prefered_floating_ip=${
          project.proxy_prefered_floating_ip
            ? project.proxy_prefered_floating_ip
            : ''
        }'`,
        `-var 'project_keycloak_host=${project.keycloak_host}'`,
        `-var 'proxy_compute_flavor_name=${
          project.proxy_cloud_flavor
            ? project.proxy_cloud_flavor
            : 'dinivas.medium'
        }'`,
        `-var 'prometheus_image_name=ShepherdCloud Prometheus'`,
        `-var 'prometheus_compute_flavor_name=${project.prometheus_cloud_flavor}'`,
        `-var 'enable_prometheus=${project.monitoring ? '1' : '0'}'`,
        `-var 'enable_logging_graylog=${
          project.logging && project.logging_stack === 'graylog' ? '1' : '0'
        }'`,
        `-var 'enable_logging_kibana=${
          project.logging && project.logging_stack === 'kibana' ? '1' : '0'
        }'`,
        `-var 'graylog_compute_image_name=${
          project.graylog_compute_image_name
            ? project.graylog_compute_image_name
            : '87912224'
        }'`,
        `-var 'graylog_compute_flavour_name=${
          project.graylog_compute_flavour_name
            ? project.graylog_compute_flavour_name
            : 's-2vcpu-4gb'
        }'`,
        `-var 'project_consul_enable=1'`,
        `-var 'project_consul_domain=${projectConsul.cluster_domain}'`,
        `-var 'project_consul_datacenter=${
          projectConsul.cluster_datacenter
            ? projectConsul.cluster_datacenter
            : project.availability_zone
        }'`,
        `-var 'project_consul_server_count=${projectConsul.server_instance_count}'`,
        `-var 'project_consul_server_image_name=${projectConsul.server_image}'`,
        `-var 'project_consul_server_flavor_name=${projectConsul.server_flavor}'`,
        `-var 'project_consul_client_count=${projectConsul.client_instance_count}'`,
        `-var 'project_consul_client_image_name=${projectConsul.client_image}'`,
        `-var 'project_consul_client_flavor_name=${projectConsul.client_flavor}'`,
        `-var 'project_consul_floating_ip_pool=${
          projectConsul.use_floating_ip ? project.floating_ip_pool : ''
        }'`,
        `-var 'do_api_token=${cloudConfig.access_token}'`,
      ];
    }
  }

  addJenkinsSlaveFilesToModule(
    jenkinsDTO: JenkinsDTO,
    projectConsul: ConsulDTO,
    cloudConfig: any,
    destination: string
  ) {
    jenkinsDTO.slave_groups.forEach(
      (slaveGroup: JenkinsSlaveGroupDTO) => {
        const slaveGroupFileContent = `
      module "jenkins-slave-${slaveGroup.code}" {
        source = "./slaves"

        project_name = "${jenkinsDTO.project.code.toLowerCase()}"
        jenkins_master_scheme = "${
          jenkinsDTO.use_existing_master && jenkinsDTO.existing_master_scheme
            ? jenkinsDTO.existing_master_scheme
            : jenkinsDTO.slave_api_scheme
            ? jenkinsDTO.slave_api_scheme
            : 'http'
        }"
        jenkins_master_host = "${
          jenkinsDTO.use_existing_master
            ? jenkinsDTO.existing_master_host
            : jenkinsDTO.slave_api_host
            ? jenkinsDTO.slave_api_host
            : '${length(module.jenkins_master_instance.network_fixed_ip_v4) > 0 ? module.jenkins_master_instance.network_fixed_ip_v4[0]: ""}'
        }"
        jenkins_master_port = "${
          jenkinsDTO.use_existing_master && jenkinsDTO.existing_master_port
            ? jenkinsDTO.existing_master_port
            : jenkinsDTO.slave_api_port
            ? jenkinsDTO.slave_api_port
            : 8080
        }"
        jenkins_master_username = "${
          jenkinsDTO.use_existing_master
            ? jenkinsDTO.existing_master_username
            : jenkinsDTO.slave_api_username
        }"
        jenkins_master_password = "${
          jenkinsDTO.use_existing_master
            ? jenkinsDTO.existing_master_password
            : jenkinsDTO.slave_api_token
        }"
        jenkins_slave_group_name = "${slaveGroup.code}"
        jenkins_slave_group_labels = "${slaveGroup.labels.join(',')}"
        jenkins_slave_group_instance_count = ${slaveGroup.instance_count}
        jenkins_slave_keypair = "${jenkinsDTO.project.code.toLowerCase()}"
        jenkins_slave_security_groups_to_associate = ["${jenkinsDTO.project.code.toLowerCase()}-common"]
        jenkins_slave_network = "${jenkinsDTO.project.code.toLowerCase()}-mgmt"
        jenkins_slave_group_cloud_image = "${slaveGroup.slave_cloud_image}"
        jenkins_slave_group_cloud_flavor   = "${slaveGroup.slave_cloud_flavor}"
        jenkins_slave_availability_zone   = "${
          jenkinsDTO.project.availability_zone
        }"
        project_consul_domain = "${projectConsul.cluster_domain}"
        project_consul_datacenter = "${projectConsul.cluster_datacenter}"
        os_auth_domain_name = "${
          cloudConfig.clouds.openstack.auth.user_domain_name
        }"
        os_auth_username = "${cloudConfig.clouds.openstack.auth.username}"
        os_auth_password = "${cloudConfig.clouds.openstack.auth.password}"
        os_auth_url = "${cloudConfig.clouds.openstack.auth.auth_url}"
        os_project_id = "${cloudConfig.clouds.openstack.auth.project_id}"
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
      }
    );
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
    const onDestroyCommand = 'consul leave';
    const jenkins_master_vars = [
      `-var 'project_name=${jenkins.project.code.toLowerCase()}'`,
      `-var 'enable_jenkins_master=${jenkins.use_existing_master ? 0 : 1}'`,
      `-var 'jenkins_master_name=${jenkins.code.toLowerCase()}'`,
      `-var 'jenkins_master_instance_count=1'`,
      `-var 'jenkins_master_availability_zone=${jenkins.project.availability_zone}'`,
      `-var 'jenkins_master_image_name=${jenkins.master_cloud_image}'`,
      `-var 'jenkins_master_compute_flavor_name=${jenkins.master_cloud_flavor}'`,
      `-var 'jenkins_master_keypair_name=${jenkins.keypair_name}'`,
      `-var 'jenkins_master_security_groups_to_associate=["${jenkins.project.code.toLowerCase()}-common"]'`,
      `-var 'jenkins_master_network=${jenkins.network_name}'`,
      `-var 'jenkins_master_subnet=${jenkins.network_subnet_name}'`,
      jenkins.use_floating_ip
        ? `-var 'jenkins_master_floating_ip_pool=${jenkins.project.floating_ip_pool}'`
        : '',
      ` -var 'jenkins_master_username=${
        jenkins.use_existing_master
          ? jenkins.existing_master_username
          : jenkins.master_admin_username
      }'`,
      ` -var 'jenkins_master_password=${
        jenkins.use_existing_master
          ? jenkins.existing_master_password
          : jenkins.master_admin_password
      }'`,
      `-var 'jenkins_master_use_keycloak=${
        jenkins.link_to_keycloak ? '1' : '0'
      }'`,
      jenkins.link_to_keycloak
        ? `-var 'jenkins_master_keycloak_host=${jenkins.project.keycloak_host}'`
        : '',
      jenkins.link_to_keycloak
        ? `-var 'jenkins_master_keycloak_client_id=${jenkins.keycloak_client_id}'`
        : '',
      `-var 'project_consul_domain=${consul.cluster_domain}'`,
      `-var 'project_consul_datacenter=${consul.cluster_datacenter}'`,
      `-var 'os_auth_domain_name=${cloudConfig.clouds.openstack.auth.user_domain_name}'`,
      `-var 'execute_on_destroy_jenkins_master_script=${onDestroyCommand}'`,
      `-var 'os_auth_username=${cloudConfig.clouds.openstack.auth.username}'`,
      `-var 'os_auth_password=${cloudConfig.clouds.openstack.auth.password}'`,
      `-var 'os_auth_url=${cloudConfig.clouds.openstack.auth.auth_url}'`,
      `-var 'os_project_id=${cloudConfig.clouds.openstack.auth.project_id}'`,
      `-var-file=ssh-via-bastion.tfvars`,
    ];
    return jenkins_master_vars;
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
