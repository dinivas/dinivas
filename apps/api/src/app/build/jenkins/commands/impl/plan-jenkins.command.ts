import { JenkinsDTO, ConsulDTO } from '@dinivas/api-interfaces';

export class PlanJenkinsCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly jenkins: JenkinsDTO,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}
}
