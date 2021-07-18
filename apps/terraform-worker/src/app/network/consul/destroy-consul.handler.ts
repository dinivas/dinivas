/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-async-promise-executor */
import { ConfigurationService } from '../../configuration.service';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TerraformDestroyEvent,
  ConsulDTO,
  DestroyConsulCommand,
} from '@dinivas/api-interfaces';
import { WSGateway } from '../../wsgateway';
import { Terraform } from '../../terraform/core';

@CommandHandler(DestroyConsulCommand)
export class DestroyConsulHandler
  implements ICommandHandler<DestroyConsulCommand>
{
  private readonly logger = new Logger(DestroyConsulHandler.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformGateway: WSGateway
  ) {
    this.terraform = new Terraform(this.configService);
  }

  async execute(command: DestroyConsulCommand) {
    return new Promise<void>(async (resolve, reject) => {
      this.logger.debug(
        `Received DestroyProjectCommand: ${command.consul.code}`
      );
      this.terraform.executeInTerraformModuleDir(
        command.consul.code,
        command.cloudprovider,
        'consul',
        command.cloudConfig,
        () => {},
        async (workingDir) => {
          try {
            await this.terraform.destroy(
              workingDir,
              [
                '-auto-approve',
                ...this.terraform.computeTerraformConsulModuleVars(command),
              ],
              {
                autoApprove: true,
                silent: false,
              }
            );
            this.terraformGateway.emit(`destroyEvent-${command.consul.code}`, {
              source: command.consul,
            } as TerraformDestroyEvent<ConsulDTO>);
            resolve();
          } catch (error) {
            this.terraformGateway.emit(
              `destroyEvent-${command.consul.code}-error`,
              error.message
            );
            reject(error);
          }
        }
      );
    });
  }
}
