import { ProjectDTO } from './../project/project.dto';
export class ConsulDTO {
  id: number;
  code: string;
  description: string;
  architecture_type: string;
  project: ProjectDTO;
  keypair_name: string;
  network_name: string;
  network_subnet_name: string;
  cluster_domain: string;
  cluster_datacenter: string;
  server_instance_count: number = 1;
  client_instance_count: number = 1;
  server_image: string;
  server_flavor: string;
  client_image: string;
  client_flavor: string;
  use_floating_ip: boolean;
}
