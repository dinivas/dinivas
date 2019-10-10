import { TerraformGateway } from '../../../../terraform/terraform.gateway';
import { RabbitMQService } from '../../rabbitmq.service';
import { ConfigService } from '../../../../core/config/config.service';
import { Terraform } from '../../../../terraform/core/Terraform';
import { DestroyRabbitMQCommand } from '../impl/destroy-rabbitmq.command';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TerraformDestroyEvent, RabbitMQDTO } from '@dinivas/dto';

@CommandHandler(DestroyRabbitMQCommand)
export class DestroyRabbitMQHandler
  implements ICommandHandler<DestroyRabbitMQCommand> {
  private readonly logger = new Logger(DestroyRabbitMQHandler.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigService,
    private readonly rabbitmqService: RabbitMQService,
    private readonly terraformGateway: TerraformGateway
  ) {
    this.terraform = new Terraform(this.configService);
  }

  async execute(command: DestroyRabbitMQCommand) {
    return new Promise(async (resolve, reject) => {
      this.logger.debug(
        `Received DestroyProjectCommand: ${command.rabbitmq.code}`
      );
      this.terraform.executeInTerraformModuleDir(
        command.rabbitmq.code,
        'rabbitmq',
        command.cloudConfig,
        workingDir =>{},
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
            this.terraformGateway.emit(`destroyEvent-${command.rabbitmq.code}`, {
              source: command.rabbitmq
            } as TerraformDestroyEvent<RabbitMQDTO>);
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
