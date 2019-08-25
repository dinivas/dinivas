import { JenkinsDTO } from '@dinivas/dto';

export class PlanJenkinsCommand {
  constructor(
    public readonly jenkins: JenkinsDTO,
    public readonly cloudConfig: any
  ) {}
}
