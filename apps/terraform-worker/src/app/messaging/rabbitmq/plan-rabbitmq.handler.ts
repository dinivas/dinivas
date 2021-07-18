import { TerraformStateService } from '../../terraform-state.service';
import { WSGateway } from '../../wsgateway';
import { ConfigurationService } from '../../configuration.service';
import { Terraform } from '../../terraform/core/Terraform';
import { Logger } from '@nestjs/common';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TerraformPlanEvent,
  TFPlanRepresentation,
  RabbitMQDTO,
  PlanRabbitMQCommand,
} from '@dinivas/api-interfaces';
import { firstValueFrom } from 'rxjs';

@CommandHandler(PlanRabbitMQCommand)
export class PlanRabbitMQHandler
  implements ICommandHandler<PlanRabbitMQCommand>
{
  private readonly logger = new Logger(PlanRabbitMQHandler.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformStateService: TerraformStateService,
    private readonly terraformGateway: WSGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: PlanRabbitMQCommand) {
    this.logger.debug(`Received PlanRabbitMQCommand: ${command.rabbitmq.code}`);
    try {
      this.terraform.executeInTerraformModuleDir(
        command.rabbitmq.code,
        command.cloudprovider,
        'rabbitmq',
        command.cloudConfig,
        async (workingDir) => {
          const rawProjectState = await firstValueFrom(
            this.terraformStateService.findState(
              command.rabbitmq.project.code.toLowerCase(),
              'project_base'
            )
          );
          this.terraform.addSshViaBastionConfigFileToModule(
            JSON.parse(rawProjectState.state),
            workingDir
          );
        },
        async (workingDir) => {
          try {
            const planResult: TFPlanRepresentation = await this.terraform.plan(
              workingDir,
              [
                ...this.terraform.computeTerraformRabbitMQModuleVars(
                  command.rabbitmq,
                  command.consul,
                  command.cloudConfig
                ),
                '-out=last-plan',
              ],
              { silent: false }
            );
            this.terraformGateway.emit(`planEvent-${command.rabbitmq.code}`, {
              source: command.rabbitmq,
              workingDir,
              planResult,
            } as TerraformPlanEvent<RabbitMQDTO>);
          } catch (error) {
            this.terraformGateway.emit(
              `planEvent-${command.rabbitmq.code}-error`,
              error.message
            );
          }
        },
        (error: any) => {
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
