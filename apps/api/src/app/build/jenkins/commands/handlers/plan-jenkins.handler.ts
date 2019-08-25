import { TerraformGateway } from './../../../../terraform/terraform.gateway';
import { ConfigService } from './../../../../core/config/config.service';
import { Terraform } from './../../../../terraform/core/Terraform';
import { PlanJenkinsCommand } from './../impl/plan-jenkins.command';
import { Logger } from '@nestjs/common';

import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TerraformPlanEvent, TFPlanRepresentation, JenkinsDTO } from '@dinivas/dto';
const fs = require('fs');
const ncp = require('ncp').ncp;
const path = require('path');
const os = require('os');

@CommandHandler(PlanJenkinsCommand)
export class PlanJenkinsHandler implements ICommandHandler<PlanJenkinsCommand> {
  private readonly logger = new Logger(PlanJenkinsHandler.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigService,
    private readonly terraformGateway: TerraformGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: PlanJenkinsCommand) {
    this.logger.debug(
      `Received PlanJenkinsCommand: ${command.jenkins.code}`
    );
    this.terraform.executeInTerraformModuleDir(
      command.jenkins.code,
      'jenkins',
      command.cloudConfig,
      async workingDir => {
        const planResult: TFPlanRepresentation = await this.terraform.plan(
          workingDir,
          [
            ...this.terraform.computeTerraformJenkinsModuleVars(
              command.jenkins
            ),
            '-out=last-plan'
          ],
          { silent: false }
        );
        this.terraformGateway.emit(`planEvent-${command.jenkins.code}`, {
          source: command.jenkins,
          workingDir,
          planResult
        } as TerraformPlanEvent<JenkinsDTO>);
      }
    );
  }
}
