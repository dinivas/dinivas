import { ProjectDTO } from './../project/project.dto';
export class JenkinsDTO {
  id: number;
  code: string;
  description: string;
  master_cloud_image: string;
  master_cloud_flavor: string;
  project: ProjectDTO;
  use_floating_ip: boolean;
}
