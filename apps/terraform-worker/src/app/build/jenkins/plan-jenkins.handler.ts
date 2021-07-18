import { ConfigurationService } from '../../configuration.service';
import { Terraform } from '../../terraform/core/Terraform';
import { Logger } from '@nestjs/common';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TerraformPlanEvent,
  TFPlanRepresentation,
  JenkinsDTO,
  PlanJenkinsCommand,
} from '@dinivas/api-interfaces';
import { WSGateway } from '../../wsgateway';
import { TerraformStateService } from '../../terraform-state.service';
import { firstValueFrom } from 'rxjs';

@CommandHandler(PlanJenkinsCommand)
export class PlanJenkinsHandler implements ICommandHandler<PlanJenkinsCommand> {
  private readonly logger = new Logger(PlanJenkinsHandler.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformStateService: TerraformStateService,
    private readonly terraformGateway: WSGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: PlanJenkinsCommand) {
    this.logger.debug(`Received PlanJenkinsCommand: ${command.jenkins.code}`);
    try {
      this.terraform.executeInTerraformModuleDir(
        command.jenkins.code,
        command.cloudprovider,
        'jenkins',
        command.cloudConfig,
        async (workingDir) => {
          const rawProjectState = await firstValueFrom(
            this.terraformStateService.findState(
              command.jenkins.project.code.toLowerCase(),
              'project_base'
            )
          );
          this.terraform.addSshViaBastionConfigFileToModule(
            JSON.parse(rawProjectState.state),
            workingDir
          );
          this.terraform.addJenkinsSlaveFilesToModule(
            command.jenkins,
            command.consul,
            command.cloudConfig,
            workingDir
          );
        },
        async (workingDir) => {
          try {
            const planResult: TFPlanRepresentation = await this.terraform.plan(
              workingDir,
              [
                ...this.terraform.computeTerraformJenkinsModuleVars(
                  command.jenkins,
                  command.consul,
                  command.cloudConfig
                ),
                '-out=last-plan',
              ],
              { silent: false }
            );
            this.terraformGateway.emit(`planEvent-${command.jenkins.code}`, {
              source: command.jenkins,
              workingDir,
              planResult,
            } as TerraformPlanEvent<JenkinsDTO>);
          } catch (error) {
            this.terraformGateway.emit(
              `planEvent-${command.jenkins.code}-error`,
              error.message
            );
          }
        },
        (error: any) => {
          this.terraformGateway.emit(
            `planEvent-${command.jenkins.code}-error`,
            error.message
          );
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}
