import { ProjectDTO } from '@dinivas/dto';

export class ApplyProjectCommand {
  constructor(
    public readonly project: ProjectDTO,
    public readonly workingDir: string
  ) {}
}
