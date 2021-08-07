import { ProjectDTO } from './../project/project.dto';
export class GitlabDTO {
  id: number;
  code: string;
  description: string;
  architecture_type: string;
  use_existing_instance: boolean;
  cloud_image: string;
  cloud_flavor: string;
  use_floating_ip = false;
  project: ProjectDTO;
  link_to_keycloak: boolean;
  keycloak_client_id = 'gitlab';
  keypair_name: string;
  manage_runner: boolean;
  network_name: string;
  network_subnet_name: string;
  admin_username = 'admin';
  admin_password = 'password';
  existing_instance_url = 'https://gitlab.com/';
  runners: GitlabRunnerDTO[];
}

export class GitlabRunnerDTO {
  id: number;
  code: string;
  runner_name: string;
  description: string;
  tags: string[] = [];
  instance_count = 1;
  runner_cloud_image: string;
  runner_cloud_flavor: string;
  runner_install_client = true;
  concurrent_jobs_count = 1;
  prometheus_listen_address = 'localhost:8787';
  log_format = 'runner';
  gitlab_url = 'https://gitlab.com/';
  gitlab_token: string;
  executor: 'shell' | 'docker' | 'docker+machine';
  shell = '';
  docker_image: string;
  docker_privileged = false;
  gitlab: GitlabDTO;
}
