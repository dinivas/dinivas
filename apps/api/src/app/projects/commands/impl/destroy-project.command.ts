import { ProjectDTO, ConsulDTO } from '@dinivas/dto';

export class DestroyProjectCommand {
  constructor(
    public readonly project: ProjectDTO,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}
}
