import { ProjectDTO } from './../project/project.dto';
export class GitlabDTO {
  id: number;
  code: string;
  description: string;
  cloud_image: string;
  cloud_flavor: string;
  project: ProjectDTO;
}
