import { ConsulDTO } from './../consul/consul.dto';
import { ProjectDTO } from './project.dto';

export class ApplyProjectCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly project: ProjectDTO,
    public readonly consul: ConsulDTO,
  ) {}

  static from<T extends ApplyProjectCommand>(json: T): ApplyProjectCommand {
    return new ApplyProjectCommand(
      json.cloudprovider,
      json.project,
      json.consul,
    );
  }
}
