import { CloudproviderDTO } from '../cloudprovider/cloudprovider.dto';
export class ProjectDTO {
  id: number;
  name: string;
  code: string;
  description: string;
  cloud_provider: CloudproviderDTO;
  availability_zone: string;
  floating_ip_pool: string;
  public_router: string;
  monitoring = false;
  logging = false;
  management_subnet_cidr: string;
  enable_proxy = true;
  proxy_cloud_flavor: string;
  logging_stack: string;
  bastion_cloud_image: string;
  bastion_cloud_flavor: string;
  prometheus_cloud_flavor: string;
}

export class ApplyModuleDTO<T> {
  source: T;
  workingDir: string;
  constructor(source: T, workingDir: string) {
    this.source = source;
    this.workingDir = workingDir;
  }
}
