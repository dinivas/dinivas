import { TerraformStateService } from './../../../../terraform/terraform-state/terraform-state.service';
import { Packer } from './../../../../packer/Packer';
import { ConfigService } from '../../../../core/config/config.service';
import { Logger } from '@nestjs/common';

import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { BuildModuleImageCommand } from '../impl/build-image.command';

@CommandHandler(BuildModuleImageCommand)
export class BuildImageCommandHandler
  implements ICommandHandler<BuildModuleImageCommand> {
  private readonly logger = new Logger(BuildImageCommandHandler.name);
  packer: Packer;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigService
  ) {
    this.packer = new Packer(configService);
  }

  async execute(command: BuildModuleImageCommand) {
    this.logger.debug(
      `Received BuildModuleImageCommand: ${command.moduleImageToBuild}`
    );
    try {
      this.packer.executeInPackerModuleDir(
        command.projectCode,
        command.moduleImageToBuild,
        command.cloudConfig,
        async (workingDir, varFileName) => {
          try {
            await this.packer.build(
              workingDir,
              [`-var-file=${varFileName}`, 'template.json'],
              {
                silent: false
              },
              command.cloudConfig
            );
          } catch (error) {}
        },
        error => {}
      );
    } catch (error) {
      console.error(error);
    }
  }
}
