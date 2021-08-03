import { TerraformStateService } from '../../terraform-state.service';
import { ConfigurationService } from '../../configuration.service';
import { Terraform } from '../../terraform/core/Terraform';
import { Injectable, Logger } from '@nestjs/common';

import {
  TerraformPlanEvent,
  TFPlanRepresentation,
  InstanceDTO,
  PlanInstanceCommand,
} from '@dinivas/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { Job } from 'bull';

@Injectable()
export class PlanInstanceHandler {
  private readonly logger = new Logger(PlanInstanceHandler.name);
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformStateService: TerraformStateService,
    private terraform: Terraform
  ) {}

  async execute(job: Job<PlanInstanceCommand>, command: PlanInstanceCommand) {
    this.logger.debug(`Received PlanInstanceCommand: ${command.instance.code}`);
    job.progress(5);
    return new Promise<any>((resolve, reject) => {
      this.terraform.executeInTerraformModuleDir(
        command.instance.code,
        command.cloudprovider,
        'project_instance',
        command.cloudConfig,
        async (workingDir) => {
          try {
            const rawProjectState = await firstValueFrom(
              this.terraformStateService.findState(
                command.instance.project.code.toLowerCase(),
                'project_base'
              )
            );

            this.terraform.addTerraformInstanceModuleFile(
              command.instance,
              command.consul,
              command.cloudConfig,
              workingDir
            );

            this.terraform.addSshViaBastionConfigFileToModule(
              command.cloudprovider,
              rawProjectState,
              workingDir
            );
          } catch (error) {
            reject(error);
          }
        },
        async (workingDir) => {
          try {
            const planResult: TFPlanRepresentation = await this.terraform.plan(
              workingDir,
              ['-var-file=ssh-via-bastion.tfvars ', '-out=tfplan'],
              {
                silent: !this.configService.getOrElse(
                  'terraform.plan.verbose',
                  false
                ),
              },
              `dinivas-project-${command.instance.project.code.toLowerCase()}`,
              `project_instance/${command.instance.code.toLowerCase()}`
            );
            const result = {
              module: 'instance',
              eventCode: `planEvent-${command.instance.code}`,
              event: {
                source: command.instance,
                planResult,
              } as TerraformPlanEvent<InstanceDTO>,
            };
            job.progress(100);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }
}
