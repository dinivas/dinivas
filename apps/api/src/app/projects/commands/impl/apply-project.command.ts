import { ProjectDTO, ConsulDTO } from '@dinivas/dto';

export class ApplyProjectCommand {
  constructor(
    public readonly project: ProjectDTO,
    public readonly consul: ConsulDTO,
    public readonly workingDir: string
  ) {}
}
