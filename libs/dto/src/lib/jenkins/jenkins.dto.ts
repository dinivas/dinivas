import { ProjectDTO } from './../project/project.dto';
export class JenkinsDTO {
  id: number;
  code: string;
  description: string;
  architecture_type: string;
  use_existing_master: boolean;
  master_cloud_image: string;
  master_cloud_flavor: string;
  project: ProjectDTO;
  use_floating_ip: boolean;
  link_to_keycloak: boolean;
  keycloak_config: string;
  master_admin_url: string;
  master_admin_username: string;
  master_admin_password: string;
  existing_master_scheme: string;
  existing_master_host: string;
  existing_master_port: number;
  existing_master_username: string;
  existing_master_password: string;
  keypair_name: string;
  manage_slave: boolean;
  network_name: string;
  network_subnet_name: string;
  slave_groups: JenkinsSlaveGroupDTO[];
}

export class JenkinsSlaveGroupDTO {
  id: number;
  code: string;
  labels: string[] = [];
  instance_count: number = 1;
  slave_cloud_image: string;
  slave_cloud_flavor: string;
  jenkins: JenkinsDTO;
}