import { TerraformStateService } from './../../../../terraform/terraform-state/terraform-state.service';
import { TerraformGateway } from './../../../../terraform/terraform.gateway';
import { ConfigService } from './../../../../core/config/config.service';
import { Terraform } from './../../../../terraform/core/Terraform';
import { PlanRabbitMQCommand } from './../impl/plan-rabbitmq.command';
import { Logger } from '@nestjs/common';

import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {
  TerraformPlanEvent,
  TFPlanRepresentation,
  RabbitMQDTO
} from '@dinivas/dto';
const fs = require('fs');
const ncp = require('ncp').ncp;
const path = require('path');
const os = require('os');

@CommandHandler(PlanRabbitMQCommand)
export class PlanRabbitMQHandler
  implements ICommandHandler<PlanRabbitMQCommand> {
  private readonly logger = new Logger(PlanRabbitMQHandler.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigService,
    private readonly terraformStateService: TerraformStateService,
    private readonly terraformGateway: TerraformGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: PlanRabbitMQCommand) {
    this.logger.debug(`Received PlanRabbitMQCommand: ${command.rabbitmq.code}`);
    try {
      this.terraform.executeInTerraformModuleDir(
        command.rabbitmq.code,
        'rabbitmq',
        command.cloudConfig,
        async workingDir => {
          const rawProjectState = await this.terraformStateService.findState(
            command.rabbitmq.project.code.toLowerCase(),
            'project_base'
          );
          this.terraform.addSshViaBastionConfigFileToModule(
            JSON.parse(rawProjectState.state),
            workingDir
          );
        },
        async workingDir => {
          try {
            const planResult: TFPlanRepresentation = await this.terraform.plan(
              workingDir,
              [
                ...this.terraform.computeTerraformRabbitMQModuleVars(
                  command.rabbitmq,
                  command.consul,
                  command.cloudConfig
                ),
                '-out=last-plan'
              ],
              { silent: false }
            );
            this.terraformGateway.emit(`planEvent-${command.rabbitmq.code}`, {
              source: command.rabbitmq,
              workingDir,
              planResult
            } as TerraformPlanEvent<RabbitMQDTO>);
          } catch (error) {
            this.terraformGateway.emit(
              `planEvent-${command.rabbitmq.code}-error`,
              error.message
            );
          }
        },
        error => {
          this.terraformGateway.emit(
            `planEvent-${command.rabbitmq.code}-error`,
            error.message
          );
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}
