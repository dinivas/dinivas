import { ConsulDTO } from './../consul/consul.dto';
import { CloudproviderDTO } from '../cloudprovider/cloudprovider.dto';
export class ProjectDTO {
  id: number;
  name: string;
  code: string;
  root_domain: string;
  description: string;
  cloud_provider: CloudproviderDTO;
  availability_zone: string;
  floating_ip_pool: string;
  public_router: string;
  monitoring = false;
  logging = false;
  management_subnet_cidr: string;
  management_subnet_dhcp_allocation_start: string;
  management_subnet_dhcp_allocation_end: string;
  enable_proxy = true;
  proxy_cloud_flavor: string;
  proxy_prefered_floating_ip: string;
  logging_stack: string;
  bastion_cloud_image: string;
  bastion_cloud_flavor: string;
  prometheus_cloud_flavor: string;
  keycloak_host: string;
  keycloak_client_id: string;
  keycloak_client_secret: string;
  status: string;
}

export class ProjectDefinitionDTO {
  project: ProjectDTO;
  consul: ConsulDTO;
}

export class ApplyModuleDTO<T> {
  source: T;
  workingDir: string;
  constructor(source: T, workingDir: string) {
    this.source = source;
    this.workingDir = workingDir;
  }
}
