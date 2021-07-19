import { ModuleImageToBuildDTO } from '@dinivas/api-interfaces';

export class BuildModuleImageCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly moduleImageToBuild: ModuleImageToBuildDTO,
    public readonly cloudConfig: unknown
  ) {}
}
