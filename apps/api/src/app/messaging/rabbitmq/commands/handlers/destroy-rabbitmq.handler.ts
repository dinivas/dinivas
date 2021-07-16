/* eslint-disable no-async-promise-executor */
import { TerraformStateService } from './../../../../terraform/terraform-state/terraform-state.service';
import { TerraformGateway } from '../../../../terraform/terraform.gateway';
import { RabbitMQService } from '../../rabbitmq.service';
import { ConfigurationService } from '../../../../core/config/configuration.service';
import { Terraform } from '../../../../terraform/core/Terraform';
import { DestroyRabbitMQCommand } from '../impl/destroy-rabbitmq.command';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TerraformDestroyEvent, RabbitMQDTO } from '@dinivas/api-interfaces';

@CommandHandler(DestroyRabbitMQCommand)
export class DestroyRabbitMQHandler
  implements ICommandHandler<DestroyRabbitMQCommand> {
  private readonly logger = new Logger(DestroyRabbitMQHandler.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigurationService,
    private readonly rabbitmqService: RabbitMQService,
    private readonly terraformStateService: TerraformStateService,
    private readonly terraformGateway: TerraformGateway
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
        async workingDir => {
          const rawProjectState = await this.terraformStateService.findState(
            command.rabbitmq.project.code.toLowerCase(),
            'project_base'
          );
          this.terraform.addSshViaBastionConfigFileToModule(
            JSON.parse(rawProjectState.state),
            workingDir
          );
        },
        async workingDir => {
          try {
            await this.terraform.destroy(
              workingDir,
              [
                '-auto-approve',
                ...this.terraform.computeTerraformRabbitMQModuleVars(
                  command.rabbitmq,
                  command.consul,
                  command.cloudConfig
                )
              ],
              {
                autoApprove: true,
                silent: false
              }
            );
            await this.rabbitmqService.delete(command.rabbitmq.id);
            this.terraformGateway.emit(
              `destroyEvent-${command.rabbitmq.code}`,
              {
                source: command.rabbitmq
              } as TerraformDestroyEvent<RabbitMQDTO>
            );
            resolve();
          } catch (error) {
            this.terraformGateway.emit(
              `destroyEvent-${command.rabbitmq.code}-error`,
              error.message
            );
          }
        }
      );
    });
  }
}
