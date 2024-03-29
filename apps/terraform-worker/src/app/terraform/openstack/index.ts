import {
  CloudProviderId,
  ConsulDTO,
  InstanceDTO,
  JenkinsDTO,
  JenkinsSlaveGroupDTO,
  ProjectDTO,
  RabbitMQDTO,
  TerraformModule,
} from '@dinivas/api-interfaces';
import fs = require('fs');
import path = require('path');

export const computeTerraformModuleTemplateContextForOpenstack = (
  moduleId: TerraformModule,
  cloudprovider: CloudProviderId,
  moduleData: any,
  projectConsul: ConsulDTO,
  cloudConfig: any,
  moduleSource: string
): any => {
  switch (moduleId) {
    case 'project_base':
      return computeTerraformProjectBaseModuleTemplateContextForOpenstack(
        moduleId,
        cloudprovider,
        moduleData,
        projectConsul,
        cloudConfig,
        moduleSource
      );
    case 'jenkins':
      return computeTerraformJenkinsModuleTemplateContextForOpenstack(
        moduleId,
        cloudprovider,
        moduleData,
        projectConsul,
        cloudConfig,
        moduleSource
      );
    case 'rabbitmq':
      return computeTerraformRabbitMQModuleTemplateContextForOpenstack(
        moduleId,
        cloudprovider,
        moduleData,
        projectConsul,
        cloudConfig,
        moduleSource
      );
    case 'consul':
      return computeTerraformConsulModuleTemplateContextForOpenstack(
        moduleId,
        cloudprovider,
        moduleData,
        projectConsul,
        cloudConfig,
        moduleSource
      );
    case 'project_instance':
      return computeTerraformInstanceModuleTemplateContextForOpenstack(
        moduleId,
        cloudprovider,
        moduleData,
        projectConsul,
        cloudConfig,
        moduleSource
      );
    default:
      break;
  }
};

const computeTerraformProjectBaseModuleTemplateContextForOpenstack = (
  moduleId: TerraformModule,
  cloudprovider: CloudProviderId,
  project: ProjectDTO,
  projectConsul: ConsulDTO,
  cloudConfig: any,
  moduleSource: string
): string[] => {
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
      project.proxy_cloud_flavor ? project.proxy_cloud_flavor : 'dinivas.medium'
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
};

const computeTerraformJenkinsModuleTemplateContextForOpenstack = (
  moduleId: TerraformModule,
  cloudprovider: CloudProviderId,
  jenkins: JenkinsDTO,
  consul: ConsulDTO,
  cloudConfig: any,
  moduleSource: string
): any => {
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
    `-var 'os_auth_username=${cloudConfig.clouds.openstack.auth.username}'`,
    `-var 'os_auth_password=${cloudConfig.clouds.openstack.auth.password}'`,
    `-var 'os_auth_url=${cloudConfig.clouds.openstack.auth.auth_url}'`,
    `-var 'os_project_id=${cloudConfig.clouds.openstack.auth.project_id}'`,
    `-var-file=ssh-via-bastion.tfvars`,
  ];
  return jenkins_master_vars;
};

const computeTerraformInstanceModuleTemplateContextForOpenstack = (
  moduleId: TerraformModule,
  cloudprovider: CloudProviderId,
  instance: InstanceDTO,
  consul: ConsulDTO,
  cloudConfig: any,
  moduleSource: string
): any => {
  return null;
};

const computeTerraformConsulModuleTemplateContextForOpenstack = (
  moduleId: TerraformModule,
  cloudprovider: CloudProviderId,
  consul: ConsulDTO,
  projectConsul: ConsulDTO,
  cloudConfig: any,
  moduleSource: string
): any => {
  return null;
};

const addJenkinsSlaveFilesToModuleForOpenstack = (
  moduleId: TerraformModule,
  cloudprovider: CloudProviderId,
  jenkinsDTO: JenkinsDTO,
  projectConsul: ConsulDTO,
  cloudConfig: any,
  destination: string,
  moduleSource: string
) => {
  jenkinsDTO.slave_groups.forEach((slaveGroup: JenkinsSlaveGroupDTO) => {
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
  });
};

const computeTerraformRabbitMQModuleTemplateContextForOpenstack = (
  moduleId: TerraformModule,
  cloudprovider: CloudProviderId,
  rabbitmq: RabbitMQDTO,
  consul: ConsulDTO,
  cloudConfig: any,
  moduleSource: string
): string[] => {
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
    `-var 'os_auth_username=${cloudConfig.clouds.openstack.auth.username}'`,
    `-var 'os_auth_password=${cloudConfig.clouds.openstack.auth.password}'`,
    `-var 'os_auth_url=${cloudConfig.clouds.openstack.auth.auth_url}'`,
    `-var 'os_project_id=${cloudConfig.clouds.openstack.auth.project_id}'`,
    `-var-file=ssh-via-bastion.tfvars`,
  ];
  return rabbitmq_cluster_vars;
};

exports = {
  computeTerraformModuleTemplateContextForOpenstack,
};
