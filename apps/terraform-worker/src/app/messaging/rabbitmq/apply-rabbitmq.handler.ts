/* eslint-disable no-async-promise-executor */
import { ConfigurationService } from '../../configuration.service';
import { Terraform } from '../../terraform/core/Terraform';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TFStateRepresentation,
  TerraformApplyEvent,
  RabbitMQDTO,
  ApplyRabbitMQCommand,
} from '@dinivas/api-interfaces';
import { WSGateway } from '../../wsgateway';

@CommandHandler(ApplyRabbitMQCommand)
export class ApplyRabbitMQHandler
  implements ICommandHandler<ApplyRabbitMQCommand>
{
  private readonly logger = new Logger(ApplyRabbitMQCommand.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformGateway: WSGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: ApplyRabbitMQCommand) {
    return new Promise<void>(async (resolve, reject) => {
      this.logger.debug(
        `Received ApplyRabbitMQCommand: ${command.rabbitmq.code}`
      );
      try {
        const stateResult: TFStateRepresentation = await this.terraform.apply(
          command.workingDir,
          ['-auto-approve', '"last-plan"'],
          { autoApprove: true, silent: false }
        );
        resolve();
        this.terraformGateway.emit(`applyEvent-${command.rabbitmq.code}`, {
          source: command.rabbitmq,
          stateResult,
        } as TerraformApplyEvent<RabbitMQDTO>);
      } catch (error) {
        this.terraformGateway.emit(
          `applyEvent-${command.rabbitmq.code}-error`,
          error.message
        );
        reject(error);
      }
    });
  }
}
