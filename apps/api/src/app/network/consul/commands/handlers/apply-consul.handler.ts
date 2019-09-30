import { TerraformGateway } from '../../../../terraform/terraform.gateway';
import { ConfigService } from '../../../../core/config/config.service';
import { Terraform } from '../../../../terraform/core/Terraform';
import { ApplyConsulCommand } from '../impl/apply-consul.command';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {
  TFStateRepresentation,
  TerraformApplyEvent,
  ConsulDTO
} from '@dinivas/dto';

@CommandHandler(ApplyConsulCommand)
export class ApplyConsulHandler
  implements ICommandHandler<ApplyConsulCommand> {
  private readonly logger = new Logger(ApplyConsulCommand.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigService,
    private readonly terraformGateway: TerraformGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: ApplyConsulCommand) {
    return new Promise(async (resolve, reject) => {
      this.logger.debug(
        `Received ApplyConsulCommand: ${command.consul.code}`
      );
      try {
        const stateResult: TFStateRepresentation = await this.terraform.apply(
          command.workingDir,
          ['-auto-approve', '"last-plan"'],
          { autoApprove: true, silent: false }
        );
        resolve();
        this.terraformGateway.emit(`applyEvent-${command.consul.code}`, {
          source: command.consul,
          stateResult
        } as TerraformApplyEvent<ConsulDTO>);
      } catch (error) {
        this.terraformGateway.emit(
          `applyEvent-${command.consul.code}-error`,
          error.message
        );
      }
    });
  }
}
