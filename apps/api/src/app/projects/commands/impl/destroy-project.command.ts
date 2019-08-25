import { ProjectDTO } from '@dinivas/dto';

export class DestroyProjectCommand {
  constructor(
    public readonly project: ProjectDTO,
    public readonly cloudConfig: any
  ) {}
}
