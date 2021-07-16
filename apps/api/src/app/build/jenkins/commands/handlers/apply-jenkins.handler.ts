/* eslint-disable no-async-promise-executor */
import { TerraformGateway } from './../../../../terraform/terraform.gateway';
import { ConfigurationService } from './../../../../core/config/configuration.service';
import { Terraform } from './../../../../terraform/core/Terraform';
import { ApplyJenkinsCommand } from './../impl/apply-jenkins.command';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {
  TFStateRepresentation,
  TerraformApplyEvent,
  JenkinsDTO
} from '@dinivas/api-interfaces';

@CommandHandler(ApplyJenkinsCommand)
export class ApplyJenkinsHandler
  implements ICommandHandler<ApplyJenkinsCommand> {
  private readonly logger = new Logger(ApplyJenkinsCommand.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigurationService,
    private readonly terraformGateway: TerraformGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: ApplyJenkinsCommand) {
    return new Promise<void>(async (resolve, reject) => {
      this.logger.debug(
        `Received ApplyJenkinsCommand: ${command.jenkins.code}`
      );
      try {
        const stateResult: TFStateRepresentation = await this.terraform.apply(
          command.workingDir,
          ['-auto-approve', '"last-plan"'],
          { autoApprove: true, silent: false }
        );
        resolve();
        this.terraformGateway.emit(`applyEvent-${command.jenkins.code}`, {
          source: command.jenkins,
          stateResult
        } as TerraformApplyEvent<JenkinsDTO>);
      } catch (error) {
        this.terraformGateway.emit(
          `applyEvent-${command.jenkins.code}-error`,
          error.message
        );
      }
    });
  }
}
