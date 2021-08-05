import { ProjectDTO } from './project/project.dto';
import {
  TerraformCommand,
  TerraformModule,
  CloudProviderId,
} from './terraform-command.interface';
import { ConsulDTO } from './consul/consul.dto';

export class CommonModuleCommand<T> implements TerraformCommand<T> {
  constructor(
    public readonly cloudprovider: CloudProviderId,
    public readonly moduleId: TerraformModule,
    public readonly commandServiceCode: string,
    public readonly data: T,
    public readonly projectCode: string,
    public readonly project: ProjectDTO,
    public readonly projectConsul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}
}
