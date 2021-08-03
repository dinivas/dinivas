import {
  ConsulDTO,
  JenkinsDTO,
  ProjectDTO,
  RabbitMQDTO,
  InstanceDTO,
} from '@dinivas/api-interfaces';

export const computeTerraformProjectBaseModuleTemplateContextForDigitalocean = (
  project: ProjectDTO,
  projectConsul: ConsulDTO,
  cloudConfig: any,
  moduleSource: string
): any => {
  return {
    module_project_base_source: moduleSource,
    project_name: project.code.toLowerCase(),
    project_description: project.description,
    project_root_domain: project.root_domain,
    project_availability_zone: project.availability_zone,
    public_router_name: project.public_router,
    mgmt_subnet_cidr: project.management_subnet_cidr
      ? project.management_subnet_cidr
      : '',
    mgmt_subnet_dhcp_allocation_start:
      project.management_subnet_dhcp_allocation_start,
    mgmt_subnet_dhcp_allocation_end:
      project.management_subnet_dhcp_allocation_end,
    bastion_image_name: project.bastion_cloud_image,
    bastion_compute_flavor_name: project.bastion_cloud_flavor,
    bastion_ssh_user: 'root',
    prometheus_image_name: 'ShepherdCloud Prometheus',
    prometheus_compute_flavor_name: project.prometheus_cloud_flavor,
    enable_proxy: project.enable_proxy ? '1' : '0',
    enable_prometheus: '0',
    proxy_image_name: project.proxy_cloud_image,
    proxy_compute_flavor_name: project.proxy_cloud_flavor
      ? project.proxy_cloud_flavor
      : 'dinivas.medium',
    proxy_prefered_floating_ip: project.proxy_prefered_floating_ip
      ? project.proxy_prefered_floating_ip
      : '',
    project_consul_enable: '1',
    project_consul_domain: projectConsul.cluster_domain,
    project_consul_datacenter: projectConsul.cluster_datacenter
      ? projectConsul.cluster_datacenter
      : project.availability_zone,
    project_consul_server_count: projectConsul.server_instance_count,
    project_consul_client_count: projectConsul.client_instance_count,
    project_consul_floating_ip_pool: '',
    project_consul_server_image_name: projectConsul.server_image,
    project_consul_server_flavor_name: projectConsul.server_flavor,
    project_consul_client_image_name: projectConsul.client_image
      ? projectConsul.client_image
      : '',
    project_consul_client_flavor_name: projectConsul.client_flavor
      ? projectConsul.client_flavor
      : '',
    enable_logging_graylog:
      project.logging && project.logging_stack === 'graylog' ? '1' : '0',
    graylog_compute_image_name: project.graylog_compute_image_name
      ? project.graylog_compute_image_name
      : '87912224',
    graylog_compute_flavour_name: project.graylog_compute_flavour_name
      ? project.graylog_compute_flavour_name
      : 's-2vcpu-4gb',
    project_keycloak_host: project.keycloak_host,
    do_api_token: cloudConfig.access_token,
  };
};

export const computeTerraformJenkinsModuleTemplateContextForDigitalocean = (
  jenkins: JenkinsDTO,
  consul: ConsulDTO,
  cloudConfig: any,
  moduleSource: string
): any => {
  const moduleJenkinsSource = moduleSource;
  return {
    module_jenkins_source: moduleJenkinsSource,
    project_name: jenkins.project.code.toLowerCase(),
    enable_jenkins_master: jenkins.use_existing_master ? 0 : 1,
    jenkins_master_name: `${jenkins.code.toLowerCase()}`,
    jenkins_master_instance_count: 1,
    jenkins_master_availability_zone: jenkins.project.availability_zone,
    jenkins_master_image_name: jenkins.master_cloud_image,
    jenkins_master_compute_flavor_name: jenkins.master_cloud_flavor,
    jenkins_master_keypair_name: jenkins.keypair_name,
    jenkins_master_security_groups_to_associate: [
      `${jenkins.project.code.toLowerCase()}-common`,
    ],
    jenkins_master_network: jenkins.network_name,
    jenkins_master_floating_ip_pool: jenkins.use_floating_ip
      ? jenkins.project.floating_ip_pool
      : '',
    jenkins_master_username: jenkins.use_existing_master
      ? jenkins.existing_master_username
      : jenkins.master_admin_username,
    jenkins_master_password: jenkins.use_existing_master
      ? jenkins.existing_master_password
      : jenkins.master_admin_password,
    jenkins_master_use_keycloak: jenkins.link_to_keycloak ? '1' : '0',
    jenkins_master_keycloak_host: jenkins.link_to_keycloak
      ? jenkins.project.keycloak_host
      : '',
    jenkins_master_keycloak_client_id: jenkins.link_to_keycloak
      ? jenkins.keycloak_client_id
      : '',
    project_consul_domain: consul.cluster_domain,
    project_consul_datacenter: consul.cluster_datacenter,
    project_keycloak_host: jenkins.project.keycloak_host,
    do_api_token: cloudConfig.access_token,
    jenkins_slaves_groups: jenkins.slave_groups.map((slaveGroup) => {
      return {
        module_jenkins_source: moduleJenkinsSource,
        project_name: jenkins.project.code.toLowerCase(),
        jenkins_slave_group_name: slaveGroup.code,
        jenkins_master_scheme:
          jenkins.use_existing_master && jenkins.existing_master_scheme
            ? jenkins.existing_master_scheme
            : jenkins.slave_api_scheme
            ? jenkins.slave_api_scheme
            : 'http',
        jenkins_master_host: jenkins.use_existing_master
          ? jenkins.existing_master_host
          : jenkins.slave_api_host
          ? jenkins.slave_api_host
          : '${module.jenkins.jenkins_master_network_private_fixed_ip_v4[0]}',
        jenkins_master_port:
          jenkins.use_existing_master && jenkins.existing_master_port
            ? jenkins.existing_master_port
            : jenkins.slave_api_port
            ? jenkins.slave_api_port
            : 8080,
        jenkins_master_username: jenkins.use_existing_master
          ? jenkins.existing_master_username
          : jenkins.slave_api_username,
        jenkins_master_password: jenkins.use_existing_master
          ? jenkins.existing_master_password
          : jenkins.slave_api_token,
        jenkins_slave_group_labels: slaveGroup.labels.join(','),
        jenkins_slave_group_instance_count: slaveGroup.instance_count,
        jenkins_slave_keypair: `${jenkins.project.code.toLowerCase()}-project-keypair`,
        jenkins_slave_security_groups_to_associate: `${jenkins.project.code.toLowerCase()}-common`,
        jenkins_slave_network: jenkins.network_name,
        jenkins_slave_group_cloud_image: slaveGroup.slave_cloud_image,
        jenkins_slave_group_cloud_flavor: slaveGroup.slave_cloud_flavor,
        jenkins_slave_availability_zone: jenkins.project.availability_zone,
        project_consul_domain: consul.cluster_domain,
        project_consul_datacenter: consul.cluster_datacenter,
        ssh_via_bastion_config: 'var.ssh_via_bastion_config',
        do_api_token: cloudConfig.access_token,
      };
    }),
  };
};

export const computeTerraformInstanceModuleTemplateContextForDigitalocean = (
  instance: InstanceDTO,
  consul: ConsulDTO,
  cloudConfig: any,
  moduleSource: string
): any => {
  return {
    module_project_instance_source: moduleSource,
    project_name: instance.project.code.toLowerCase(),
    instance_name: instance.code.toLowerCase(),
    instance_count: 1,
    instance_image_name: instance.cloud_image,
    instance_flavor_name: instance.cloud_flavor,
    instance_keypair_name: instance.keypair_name,
    instance_network: instance.network_name,
    instance_subnet: instance.network_subnet_name,
    instance_security_groups_to_associate: `${instance.project.code.toLowerCase()}-common`,
    project_consul_domain: consul.cluster_domain,
    project_consul_datacenter: consul.cluster_datacenter,
    instance_availability_zone: instance.project.availability_zone,
    project_keycloak_host: instance.project.keycloak_host,
    do_api_token: cloudConfig.access_token,
  };
};
export const computeTerraformConsulModuleTemplateContextForDigitalocean = (
  consul: ConsulDTO,
  projectConsul: ConsulDTO,
  cloudConfig: any,
  moduleSource: string
): any => {
  return {
    module_consul_source: moduleSource,
    project_name: consul.project.code.toLowerCase(),
    project_consul_domain: projectConsul.cluster_domain,
    project_consul_datacenter: projectConsul.cluster_datacenter,

    enable_consul_cluster: 1,
    consul_cluster_name: consul.code.toLowerCase(),
    consul_cluster_domain: consul.cluster_domain,
    consul_cluster_datacenter: consul.cluster_datacenter,
    consul_cluster_availability_zone: consul.project.availability_zone,
    consul_server_image_name: consul.server_image,
    consul_server_flavor_name: consul.server_flavor,
    consul_client_image_name: consul.client_image,
    consul_client_flavor_name: consul.client_flavor,
    consul_server_instance_count: consul.server_instance_count,
    consul_client_instance_count: consul.client_instance_count,
    consul_server_keypair_name: consul.keypair_name,
    consul_client_keypair_name: consul.keypair_name,
    consul_cluster_security_groups_to_associate: `${consul.project.code.toLowerCase()}-common}`,
    consul_cluster_network: consul.network_name,
    do_api_token: cloudConfig.access_token,
  };
};

export const computeTerraformRabbitMQModuleTemplateContextForDigitalocean = (
  rabbitmq: RabbitMQDTO,
  consul: ConsulDTO,
  cloudConfig: any,
  moduleSource: string
): any => {
  const moduleRabbitMQSource = moduleSource;

  return {
    module_rabbitmq_source: moduleRabbitMQSource,
    project_name: rabbitmq.project.code.toLowerCase(),
    enable_rabbitmq: 1,
    rabbitmq_cluster_name: rabbitmq.code.toLowerCase(),
    rabbitmq_nodes_count: rabbitmq.cluster_instance_count,
    rabbitmq_cluster_availability_zone: rabbitmq.project.availability_zone,
    rabbitmq_cluster_image_name: rabbitmq.cluster_cloud_image,
    rabbitmq_cluster_compute_flavor_name: rabbitmq.cluster_cloud_flavor,
    rabbitmq_cluster_keypair_name: rabbitmq.keypair_name,
    rabbitmq_cluster_network: rabbitmq.network_name,
    rabbitmq_cluster_security_groups_to_associate: `rabbitmq.project.code.toLowerCase()}-common`,
    rabbitmq_plugin_list: rabbitmq.enabled_plugin_list,
    project_consul_domain: consul.cluster_domain,
    project_consul_datacenter: consul.cluster_datacenter,
    do_api_token: cloudConfig.access_token,
    project_keycloak_host: rabbitmq.project.keycloak_host,
  };
};

exports = {
  computeTerraformProjectBaseModuleTemplateContextForDigitalocean,
  computeTerraformJenkinsModuleTemplateContextForDigitalocean,
  computeTerraformRabbitMQModuleTemplateContextForDigitalocean,
  computeTerraformInstanceModuleTemplateContextForDigitalocean,
  computeTerraformConsulModuleTemplateContextForDigitalocean,
};
