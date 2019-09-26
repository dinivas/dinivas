import { ModuleImageToBuildDTO } from '@dinivas/dto';

export class BuildModuleImageCommand {
  constructor(
    public readonly projectCode: string,
    public readonly moduleImageToBuild: ModuleImageToBuildDTO,
    public readonly cloudConfig: any
  ) {}
}
