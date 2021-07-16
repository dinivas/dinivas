import { ProjectDTO } from './../project/project.dto';
export class PostgresqlDTO {
  id: number;
  code: string;
  description: string;
  cloud_image: string;
  cloud_flavor: string;
  project: ProjectDTO;
}
