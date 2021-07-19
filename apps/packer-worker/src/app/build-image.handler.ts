import { BuildModuleImageCommand } from '@dinivas/api-interfaces';
import { Logger } from '@nestjs/common';

import { CommandHandler } from '@nestjs/cqrs';
import { Job } from 'bull';
import { ConfigurationService } from './configuration.service';
import { Packer } from './packer/Packer';

@CommandHandler(BuildModuleImageCommand)
export class BuildImageCommandHandler {
  private readonly logger = new Logger(BuildImageCommandHandler.name);
  packer: Packer;
  constructor(private readonly configService: ConfigurationService) {
    this.packer = new Packer(configService);
  }

  async execute(
    job: Job<BuildModuleImageCommand>,
    command: BuildModuleImageCommand
  ) {
    this.logger.debug(
      `Received BuildModuleImageCommand: ${command.moduleImageToBuild}`
    );
    job.log(`Received BuildModuleImageCommand: ${command.moduleImageToBuild}`);
    job.progress(5);
    return new Promise<{ eventCode: string; event: BuildModuleImageCommand }>(
      (resolve, reject) => {
        this.packer.executeInPackerModuleDir(
          command.moduleImageToBuild,
          command.cloudConfig,
          async (workingDir, varFileName) => {
            try {
              await this.packer.build(
                command.cloudprovider,
                workingDir,
                [
                  `-only=${command.cloudprovider}`,
                  `-var-file=${varFileName}`,
                  'template.json',
                ],
                {
                  silent: this.configService.getOrElse(
                    'packer.build.log_silent',
                    false
                  ),
                },
                command.cloudConfig
              );
              resolve({ eventCode: 'build', event: command });
            } catch (error) {
              reject(error);
            }
          },
          (error) => {
            this.logger.error(error);
            reject(error);
          }
        );
      }
    );
  }
}
