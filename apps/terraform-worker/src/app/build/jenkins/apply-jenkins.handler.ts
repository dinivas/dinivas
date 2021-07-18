/* eslint-disable no-async-promise-executor */
import { WSGateway } from '../../wsgateway';
import { ConfigurationService } from '../../configuration.service';
import { Terraform } from '../../terraform/core/Terraform';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TFStateRepresentation,
  TerraformApplyEvent,
  JenkinsDTO,
  ApplyJenkinsCommand,
} from '@dinivas/api-interfaces';

@CommandHandler(ApplyJenkinsCommand)
export class ApplyJenkinsHandler
  implements ICommandHandler<ApplyJenkinsCommand>
{
  private readonly logger = new Logger(ApplyJenkinsHandler.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformGateway: WSGateway
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
          stateResult,
        } as TerraformApplyEvent<JenkinsDTO>);
      } catch (error) {
        this.terraformGateway.emit(
          `applyEvent-${command.jenkins.code}-error`,
          error.message
        );
        reject(error);
      }
    });
  }
}
