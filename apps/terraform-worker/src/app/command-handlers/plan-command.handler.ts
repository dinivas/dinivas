import { Terraform } from '../terraform/core/Terraform';
import { ConfigurationService } from '../configuration.service';
import { Injectable, Logger } from '@nestjs/common';
import {
  TerraformModuleEvent,
  TFPlanRepresentation,
  TerraformCommand,
} from '@dinivas/api-interfaces';
import { TerraformStateService } from '../terraform-state.service';
import { firstValueFrom } from 'rxjs';
import { Job } from 'bull';

@Injectable()
export class PlanCommandHandler {
  private readonly logger = new Logger(PlanCommandHandler.name);
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformStateService: TerraformStateService,
    private terraform: Terraform
  ) {}

  async execute(
    job: Job<TerraformCommand<any>>,
    command: TerraformCommand<any>
  ) {
    const receivedLogText = `Received PlanCommand: CloudProvider: ${command.cloudprovider}, Module: ${command.moduleId} Service Code: ${command.commandServiceCode}`;
    this.logger.debug(receivedLogText);
    job.log(receivedLogText);
    job.progress(5);
    return new Promise<any>((resolve, reject) => {
      this.terraform.executeInTerraformModuleDir(
        command.commandServiceCode,
        command.cloudprovider,
        command.moduleId,
        command.cloudConfig,
        async (workingDir) => {
          const rawProjectState = await firstValueFrom(
            this.terraformStateService.findState(
              command.projectCode.toLowerCase(),
              'project_base'
            )
          );
          this.terraform.addTerraformModuleFile(
            command.moduleId,
            command.cloudprovider,
            command.data,
            command.projectConsul,
            command.cloudConfig,
            workingDir
          );
          job.progress(15);
          if ('project_base' !== command.moduleId) {
            this.terraform.addSshViaBastionConfigFileToModule(
              command.project.cloud_provider.cloud,
              rawProjectState,
              workingDir
            );
            job.progress(25);
          }
        },
        async (workingDir) => {
          try {
            job.progress(60);
            this.terraform.addKeycloakProviderConfigFileToModule(
              command.project,
              workingDir
            );

            const planResult: TFPlanRepresentation = await this.terraform.plan(
              workingDir,
              [
                'project_base' !== command.moduleId
                  ? '-var-file=ssh-via-bastion.tfvars'
                  : '',
                '-out=tfplan',
              ],
              {
                silent: !this.configService.getOrElse(
                  'terraform.plan.verbose',
                  false
                ),
              },
              `dinivas-project-${command.projectCode.toLowerCase()}`,
              `${command.moduleId}/${command.commandServiceCode}`
            );
            job.progress(95);
            const result = {
              module: command.moduleId,
              eventCode: `planEvent-${command.commandServiceCode}`,
              event: {
                source: {
                  data: command.data,
                  project: command.project,
                  consul: command.projectConsul,
                },
                planResult,
              } as TerraformModuleEvent<any>,
            };
            job.progress(100);
            resolve(result);
          } catch (error) {
            this.logger.error(error);
            reject(error);
          }
        },
        (err) => reject(err)
      );
    });
  }
}
