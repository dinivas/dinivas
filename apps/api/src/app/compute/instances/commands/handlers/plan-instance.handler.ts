import { TerraformStateService } from '../../../../terraform/terraform-state/terraform-state.service';
import { TerraformGateway } from '../../../../terraform/terraform.gateway';
import { ConfigService } from '../../../../core/config/config.service';
import { Terraform } from '../../../../terraform/core/Terraform';
import { PlanInstanceCommand } from '../impl/plan-instance.command';
import { Logger } from '@nestjs/common';

import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {
  TerraformPlanEvent,
  TFPlanRepresentation,
  InstanceDTO
} from '@dinivas/dto';
const fs = require('fs');
const ncp = require('ncp').ncp;
const path = require('path');
const os = require('os');

@CommandHandler(PlanInstanceCommand)
export class PlanInstanceHandler implements ICommandHandler<PlanInstanceCommand> {
  private readonly logger = new Logger(PlanInstanceHandler.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigService,
    private readonly terraformStateService: TerraformStateService,
    private readonly terraformGateway: TerraformGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: PlanInstanceCommand) {
    this.logger.debug(`Received PlanInstanceCommand: ${command.instance.code}`);
    try {
      this.terraform.executeInTerraformModuleDir(
        command.instance.code,
        'project_instance',
        command.cloudConfig,
        async workingDir => {
          const rawProjectState = await this.terraformStateService.findState(
            command.instance.project.code.toLowerCase(),
            'project_base'
          );
          this.terraform.addSshViaBastionConfigFileToModule(JSON.parse(rawProjectState.state), workingDir);
        },
        async workingDir => {
          try {
            const planResult: TFPlanRepresentation = await this.terraform.plan(
              workingDir,
              [
                ...this.terraform.computeTerraformInstanceModuleVars(
                  command.instance,
                  command.consul,
                  command.cloudConfig
                ),
                '-out=last-plan'
              ],
              { silent: false }
            );
            this.terraformGateway.emit(`planEvent-${command.instance.code}`, {
              source: command.instance,
              workingDir,
              planResult
            } as TerraformPlanEvent<InstanceDTO>);
          } catch (error) {
            this.terraformGateway.emit(
              `planEvent-${command.instance.code}-error`,
              error.message
            );
          }
        },
        error => {
          this.terraformGateway.emit(
            `planEvent-${command.instance.code}-error`,
            error.message
          );
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}
