/* eslint-disable no-async-promise-executor */
import { TerraformStateService } from '../../terraform-state.service';
import { WSGateway } from '../../wsgateway';
import { ConfigurationService } from '../../configuration.service';
import { Terraform } from '../../terraform/core/Terraform';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TerraformDestroyEvent,
  RabbitMQDTO,
  DestroyRabbitMQCommand,
} from '@dinivas/api-interfaces';
import { firstValueFrom } from 'rxjs';

@CommandHandler(DestroyRabbitMQCommand)
export class DestroyRabbitMQHandler
  implements ICommandHandler<DestroyRabbitMQCommand>
{
  private readonly logger = new Logger(DestroyRabbitMQHandler.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformStateService: TerraformStateService,
    private readonly terraformGateway: WSGateway
  ) {
    this.terraform = new Terraform(this.configService);
  }

  async execute(command: DestroyRabbitMQCommand) {
    return new Promise<void>(async (resolve, reject) => {
      this.logger.debug(
        `Received DestroyProjectCommand: ${command.rabbitmq.code}`
      );
      this.terraform.executeInTerraformModuleDir(
        command.rabbitmq.code,
        command.cloudprovider,
        'rabbitmq',
        command.cloudConfig,
        async (workingDir) => {
          const rawProjectState = await firstValueFrom(
            this.terraformStateService.findState(
              command.rabbitmq.project.code.toLowerCase(),
              'project_base'
            )
          );
          this.terraform.addSshViaBastionConfigFileToModule(
            JSON.parse(rawProjectState.state),
            workingDir
          );
        },
        async (workingDir) => {
          try {
            await this.terraform.destroy(
              workingDir,
              [
                '-auto-approve',
                ...this.terraform.computeTerraformRabbitMQModuleVars(
                  command.rabbitmq,
                  command.consul,
                  command.cloudConfig
                ),
              ],
              {
                autoApprove: true,
                silent: false,
              }
            );
            this.terraformGateway.emit(
              `destroyEvent-${command.rabbitmq.code}`,
              {
                source: command.rabbitmq,
              } as TerraformDestroyEvent<RabbitMQDTO>
            );
            resolve();
          } catch (error) {
            this.terraformGateway.emit(
              `destroyEvent-${command.rabbitmq.code}-error`,
              error.message
            );
            reject(error);
          }
        }
      );
    });
  }
}
