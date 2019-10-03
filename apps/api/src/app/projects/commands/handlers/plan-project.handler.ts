import { TerraformGateway } from './../../../terraform/terraform.gateway';
import { Terraform } from './../../../terraform/core/Terraform';
import { ConfigService } from './../../../core/config/config.service';
import { Logger } from '@nestjs/common';
import { PlanProjectCommand } from './../impl/plan-project.command';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {
  TerraformPlanEvent,
  TFPlanRepresentation,
  ProjectDTO
} from '@dinivas/dto';
const fs = require('fs');
const ncp = require('ncp').ncp;
const path = require('path');
const os = require('os');

@CommandHandler(PlanProjectCommand)
export class PlanProjectHandler implements ICommandHandler<PlanProjectCommand> {
  private readonly logger = new Logger(PlanProjectHandler.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigService,
    private readonly terraformGateway: TerraformGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: PlanProjectCommand) {
    this.logger.debug(
      `Received PlanProjectCommand: ${command.projectName} (${
        command.projectCode
      })`
    );
    this.terraform.executeInTerraformModuleDir(
      command.projectCode,
      'project_base',
      command.cloudConfig,
      null,
      async workingDir => {
        try {
          const planResult: TFPlanRepresentation = await this.terraform.plan(
            workingDir,
            [
              ...this.terraform.computeTerraformProjectBaseModuleVars(
                command.project,
                command.consul,
                command.cloudConfig
              ),
              '-out=last-plan'
            ],
            { silent: false }
          );
          this.terraformGateway.emit(`planEvent-${command.projectCode}`, {
            source: command.project,
            workingDir,
            planResult
          } as TerraformPlanEvent<ProjectDTO>);
        } catch (error) {
          this.terraformGateway.emit(
            `planEvent-${command.projectCode}-error`,
            error.message
          );
        }
      }
    );
  }
}
