import { TerraformGateway } from '../../../../terraform/terraform.gateway';
import { ConfigurationService } from '../../../../core/config/configuration.service';
import { Terraform } from '../../../../terraform/core/Terraform';
import { PlanConsulCommand } from '../impl/plan-consul.command';
import { Logger } from '@nestjs/common';

import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {
  TerraformPlanEvent,
  TFPlanRepresentation,
  ConsulDTO
} from '@dinivas/api-interfaces';

@CommandHandler(PlanConsulCommand)
export class PlanConsulHandler implements ICommandHandler<PlanConsulCommand> {
  private readonly logger = new Logger(PlanConsulHandler.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigurationService,
    private readonly terraformGateway: TerraformGateway
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
        async workingDir => {
          try {
            const planResult: TFPlanRepresentation = await this.terraform.plan(
              workingDir,
              [
                ...this.terraform.computeTerraformConsulModuleVars(
                  command
                ),
                '-out=last-plan'
              ],
              { silent: false }
            );
            this.terraformGateway.emit(`planEvent-${command.consul.code}`, {
              source: command.consul,
              workingDir,
              planResult
            } as TerraformPlanEvent<ConsulDTO>);
          } catch (error) {
            this.terraformGateway.emit(
              `planEvent-${command.consul.code}-error`,
              error.message
            );
          }
        },
        error => {
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
