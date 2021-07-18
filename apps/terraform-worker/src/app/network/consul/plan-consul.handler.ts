import { Logger } from '@nestjs/common';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TerraformPlanEvent,
  TFPlanRepresentation,
  ConsulDTO,
  PlanConsulCommand,
} from '@dinivas/api-interfaces';
import { Terraform } from '../../terraform/core';
import { ConfigurationService } from '../../configuration.service';
import { WSGateway } from '../../wsgateway';

@CommandHandler(PlanConsulCommand)
export class PlanConsulHandler implements ICommandHandler<PlanConsulCommand> {
  private readonly logger = new Logger(PlanConsulHandler.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformGateway: WSGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: PlanConsulCommand) {
    this.logger.debug(`Received PlanConsulCommand: ${command.consul.code}`);
    try {
      this.terraform.executeInTerraformModuleDir(
        command.consul.code,
        command.cloudprovider,
        'consul',
        command.cloudConfig,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
        async (workingDir) => {
          try {
            const planResult: TFPlanRepresentation = await this.terraform.plan(
              workingDir,
              [
                ...this.terraform.computeTerraformConsulModuleVars(command),
                '-out=last-plan',
              ],
              { silent: false }
            );
            this.terraformGateway.emit(`planEvent-${command.consul.code}`, {
              source: command.consul,
              workingDir,
              planResult,
            } as TerraformPlanEvent<ConsulDTO>);
          } catch (error) {
            this.terraformGateway.emit(
              `planEvent-${command.consul.code}-error`,
              error.message
            );
          }
        },
        (error) => {
          this.terraformGateway.emit(
            `planEvent-${command.consul.code}-error`,
            error.message
          );
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}
