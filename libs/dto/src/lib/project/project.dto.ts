import { CloudproviderDTO } from '../cloudprovider/cloudprovider.dto';
export class ProjectDTO {
  id: number;
  name: string;
  code: string;
  description: string;
  cloud_provider: CloudproviderDTO;
  floating_ip_pool: string;
  public_router: string;
  monitoring = false;
  logging = false;
  logging_stack: string;
}

export class ApplyProjectDTO {
  project: ProjectDTO;
  workingDir: string;
  constructor(project: ProjectDTO, workingDir: string) {
    this.project = project;
    this.workingDir = workingDir;
  }
}
