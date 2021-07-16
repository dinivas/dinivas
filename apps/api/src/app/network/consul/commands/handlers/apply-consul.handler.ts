/* eslint-disable no-async-promise-executor */
import { TerraformGateway } from '../../../../terraform/terraform.gateway';
import { ConfigurationService } from '../../../../core/config/configuration.service';
import { Terraform } from '../../../../terraform/core/Terraform';
import { ApplyConsulCommand } from '../impl/apply-consul.command';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {
  TFStateRepresentation,
  TerraformApplyEvent,
  ConsulDTO
} from '@dinivas/api-interfaces';

@CommandHandler(ApplyConsulCommand)
export class ApplyConsulHandler
  implements ICommandHandler<ApplyConsulCommand> {
  private readonly logger = new Logger(ApplyConsulCommand.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigurationService,
    private readonly terraformGateway: TerraformGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: ApplyConsulCommand) {
    return new Promise<void>(async (resolve, reject) => {
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
