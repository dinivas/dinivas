import { TerraformGateway } from './../../../terraform/terraform.gateway';
import { Terraform } from './../../../terraform/core/Terraform';
import { ConfigurationService } from './../../../core/config/configuration.service';
import { Logger } from '@nestjs/common';
import { PlanProjectCommand } from './../impl/plan-project.command';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {
  TerraformPlanEvent,
  TFPlanRepresentation,
  ProjectDTO
} from '@dinivas/api-interfaces';

@CommandHandler(PlanProjectCommand)
export class PlanProjectHandler implements ICommandHandler<PlanProjectCommand> {
  private readonly logger = new Logger(PlanProjectHandler.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigurationService,
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
      command.cloudprovider,
      'project_base',
      command.cloudConfig,
      null,
      async workingDir => {
        try {
          this.terraform.addKeycloakProviderConfigFileToModule(command.project, workingDir);
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
