import { ConsulDTO } from './../consul/consul.dto';
import { JenkinsDTO } from './jenkins.dto';

export class DestroyJenkinsCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly jenkins: JenkinsDTO,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}

  static from<T extends DestroyJenkinsCommand>(json: T): DestroyJenkinsCommand {
    return new DestroyJenkinsCommand(
      json.cloudprovider,
      json.jenkins,
      json.consul,
      json.cloudConfig
    );
  }
}
