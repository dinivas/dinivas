import { ProjectDTO } from './../project/project.dto';
export class JenkinsDTO {
  id: number;
  code: string;
  description: string;
  use_existing_master: boolean;
  master_cloud_image: string;
  master_cloud_flavor: string;
  project: ProjectDTO;
  use_floating_ip: boolean;
  existing_master_url: string;
  master_admin_username: string;
  master_admin_password: string;
  existing_master_username: string;
  existing_master_password: string;
  manage_slave: boolean;
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