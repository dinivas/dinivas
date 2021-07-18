import { ProjectDTO, ConsulDTO } from '@dinivas/api-interfaces';

export class ApplyProjectCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly project: ProjectDTO,
    public readonly consul: ConsulDTO,
    public readonly workingDir: string
  ) {}

  static from<T extends ApplyProjectCommand>(json: T): ApplyProjectCommand {
    return new ApplyProjectCommand(
      json.cloudprovider,
      json.project,
      json.consul,
      json.workingDir
    );
  }
}
