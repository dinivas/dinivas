import { Packer } from './../../../../packer/Packer';
import { Logger } from '@nestjs/common';

import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { BuildModuleImageCommand } from '../impl/build-image.command';
import { ConfigurationService } from '../../../../core/config/configuration.service';

@CommandHandler(BuildModuleImageCommand)
export class BuildImageCommandHandler
  implements ICommandHandler<BuildModuleImageCommand>
{
  private readonly logger = new Logger(BuildImageCommandHandler.name);
  packer: Packer;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigurationService
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
                silent: false,
              },
              command.cloudConfig
            );
          } catch (error) {
            this.logger.error(error);
          }
        },
        (error) => {
          this.logger.error(error);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}
