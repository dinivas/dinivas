import { ProjectDTO } from './../project/project.dto';
export class InstanceDTO {
  id: number;
  code: string;
  description: string;
  project: ProjectDTO;
  use_floating_ip: boolean;
  cloud_image: string;
  cloud_flavor: string;
  keypair_name: string;
  network_name: string;
  network_subnet_name: string;
  availability_zone: string;
}
