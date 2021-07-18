/* eslint-disable no-async-promise-executor */
import { ConfigurationService } from '../../configuration.service';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TFStateRepresentation,
  TerraformApplyEvent,
  ConsulDTO,
  ApplyConsulCommand,
} from '@dinivas/api-interfaces';
import { WSGateway } from '../../wsgateway';
import { Terraform } from '../../terraform/core';

@CommandHandler(ApplyConsulCommand)
export class ApplyConsulHandler implements ICommandHandler<ApplyConsulCommand> {
  private readonly logger = new Logger(ApplyConsulCommand.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformGateway: WSGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: ApplyConsulCommand) {
    return new Promise<void>(async (resolve, reject) => {
      this.logger.debug(`Received ApplyConsulCommand: ${command.consul.code}`);
      try {
        const stateResult: TFStateRepresentation = await this.terraform.apply(
          command.workingDir,
          ['-auto-approve', '"last-plan"'],
          { autoApprove: true, silent: false }
        );
        resolve();
        this.terraformGateway.emit(`applyEvent-${command.consul.code}`, {
          source: command.consul,
          stateResult,
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
