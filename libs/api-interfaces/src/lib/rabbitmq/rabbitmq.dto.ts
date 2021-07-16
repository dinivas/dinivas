import { ProjectDTO } from '../project/project.dto';
export class RabbitMQDTO {
  id: number;
  code: string;
  description: string;
  architecture_type: string;
  cluster_cloud_image: string;
  cluster_cloud_flavor: string;
  project: ProjectDTO;
  use_floating_ip: boolean;
  network_name: string;
  network_subnet_name: string;
  keypair_name: string;
  cluster_instance_count = 1;
  enabled_plugin_list: string;
  cluster_availability_zone: string;
}
