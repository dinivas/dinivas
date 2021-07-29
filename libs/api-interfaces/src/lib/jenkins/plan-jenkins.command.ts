import { ConsulDTO } from './../consul/consul.dto';
import { JenkinsDTO } from './jenkins.dto';

export class PlanJenkinsCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly jenkins: JenkinsDTO,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}

  static from<T extends PlanJenkinsCommand>(json: T): PlanJenkinsCommand {
    return new PlanJenkinsCommand(
      json.cloudprovider,
      json.jenkins,
      json.consul,
      json.cloudConfig
    );
  }
}
