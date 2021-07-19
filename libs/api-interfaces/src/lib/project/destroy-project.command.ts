import { ProjectDTO, ConsulDTO } from '@dinivas/api-interfaces';

export class DestroyProjectCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly project: ProjectDTO,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}

  static from<T extends DestroyProjectCommand>(json: T): DestroyProjectCommand {
    return new DestroyProjectCommand(
      json.cloudprovider,
      json.project,
      json.consul,
      json.cloudConfig
    );
  }
}