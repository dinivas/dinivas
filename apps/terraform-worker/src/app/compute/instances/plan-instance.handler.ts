import { TerraformStateService } from '../../terraform-state.service';
import { ConfigurationService } from '../../configuration.service';
import { Terraform } from '../../terraform/core/Terraform';
import { Logger } from '@nestjs/common';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TerraformPlanEvent,
  TFPlanRepresentation,
  InstanceDTO,
  PlanInstanceCommand,
} from '@dinivas/api-interfaces';
import { WSGateway } from '../../wsgateway';
import { firstValueFrom } from 'rxjs';

@CommandHandler(PlanInstanceCommand)
export class PlanInstanceHandler
  implements ICommandHandler<PlanInstanceCommand>
{
  private readonly logger = new Logger(PlanInstanceHandler.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformStateService: TerraformStateService,
    private readonly terraformGateway: WSGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: PlanInstanceCommand) {
    this.logger.debug(`Received PlanInstanceCommand: ${command.instance.code}`);
    try {
      this.terraform.executeInTerraformModuleDir(
        command.instance.code,
        command.cloudprovider,
        'project_instance',
        command.cloudConfig,
        async (workingDir) => {
          const rawProjectState = await firstValueFrom(
            this.terraformStateService.findState(
              command.instance.project.code.toLowerCase(),
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
                ...this.terraform.computeTerraformInstanceModuleVars(
                  command.instance,
                  command.consul,
                  command.cloudConfig
                ),
                '-out=last-plan',
              ],
              { silent: false }
            );
            this.terraformGateway.emit(`planEvent-${command.instance.code}`, {
              source: command.instance,
              workingDir,
              planResult,
            } as TerraformPlanEvent<InstanceDTO>);
          } catch (error) {
            this.terraformGateway.emit(
              `planEvent-${command.instance.code}-error`,
              error.message
            );
          }
        },
        (error: any) => {
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
