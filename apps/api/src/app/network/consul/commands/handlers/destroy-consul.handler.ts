/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-async-promise-executor */
import { TerraformGateway } from '../../../../terraform/terraform.gateway';
import { ConsulService } from './../../consul.service';
import { ConfigurationService } from '../../../../core/config/configuration.service';
import { Terraform } from '../../../../terraform/core/Terraform';
import { DestroyConsulCommand } from '../impl/destroy-consul.command';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TerraformDestroyEvent, ConsulDTO } from '@dinivas/api-interfaces';

@CommandHandler(DestroyConsulCommand)
export class DestroyConsulHandler
  implements ICommandHandler<DestroyConsulCommand>
{
  private readonly logger = new Logger(DestroyConsulHandler.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigurationService,
    private readonly consulService: ConsulService,
    private readonly terraformGateway: TerraformGateway
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
            await this.consulService.delete(command.consul.id);
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
