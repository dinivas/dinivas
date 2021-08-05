import { ProjectDTO } from '@dinivas/api-interfaces';
import { ConsulDTO } from './consul/consul.dto';
export type TerraformModule =
  | 'project_base'
  | 'jenkins'
  | 'rabbitmq'
  | 'project_instance'
  | 'consul';

export type CloudProviderId = 'openstack' | 'digitalocean' | 'aws';

export interface TerraformCommand<T> {
  cloudprovider: CloudProviderId;
  moduleId: TerraformModule;
  commandServiceCode: string;
  data: T;
  projectCode: string;
  project: ProjectDTO;
  projectConsul: ConsulDTO;
  cloudConfig: any;
}
