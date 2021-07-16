/* eslint-disable no-async-promise-executor */
import { ApplyProjectCommand } from './../impl/apply-project.command';
import { TerraformGateway } from './../../../terraform/terraform.gateway';
import { Terraform } from './../../../terraform/core/Terraform';
import { ConfigurationService } from './../../../core/config/configuration.service';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {
  TFStateRepresentation,
  TerraformApplyEvent,
  ProjectDTO,
} from '@dinivas/api-interfaces';

@CommandHandler(ApplyProjectCommand)
export class ApplyProjectHandler
  implements ICommandHandler<ApplyProjectCommand>
{
  private readonly logger = new Logger(ApplyProjectCommand.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigurationService,
    private readonly terraformGateway: TerraformGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: ApplyProjectCommand) {
    return new Promise<void>(async (resolve, reject) => {
      this.logger.debug(
        `Received ApplyProjectCommand: ${command.project.name} (${command.project.name})`
      );
      try {
        const stateResult: TFStateRepresentation = await this.terraform.apply(
          command.workingDir,
          ['-auto-approve', '"last-plan"'],
          { autoApprove: true, silent: false }
        );
        resolve();
        this.terraformGateway.emit(`applyEvent-${command.project.code}`, {
          source: command.project,
          stateResult,
        } as TerraformApplyEvent<ProjectDTO>);
      } catch (error) {
        this.terraformGateway.emit(
          `applyEvent-${command.project.code}-error`,
          error.message
        );
        reject(error);
      }
    });
  }
}
