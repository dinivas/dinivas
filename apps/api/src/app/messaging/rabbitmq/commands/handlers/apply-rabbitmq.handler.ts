import { TerraformGateway } from '../../../../terraform/terraform.gateway';
import { ConfigService } from '../../../../core/config/config.service';
import { Terraform } from '../../../../terraform/core/Terraform';
import { ApplyRabbitMQCommand } from '../impl/apply-rabbitmq.command';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {
  TFStateRepresentation,
  TerraformApplyEvent,
  RabbitMQDTO
} from '@dinivas/dto';

@CommandHandler(ApplyRabbitMQCommand)
export class ApplyRabbitMQHandler
  implements ICommandHandler<ApplyRabbitMQCommand> {
  private readonly logger = new Logger(ApplyRabbitMQCommand.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigService,
    private readonly terraformGateway: TerraformGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: ApplyRabbitMQCommand) {
    return new Promise(async (resolve, reject) => {
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
          stateResult
        } as TerraformApplyEvent<RabbitMQDTO>);
      } catch (error) {
        this.terraformGateway.emit(
          `applyEvent-${command.rabbitmq.code}-error`,
          error.message
        );
      }
    });
  }
}
