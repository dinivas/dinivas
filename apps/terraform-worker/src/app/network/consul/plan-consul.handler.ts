import { TerraformStateService } from './../../terraform-state.service';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  TerraformPlanEvent,
  TFPlanRepresentation,
  ConsulDTO,
  PlanConsulCommand,
} from '@dinivas/api-interfaces';
import { Terraform } from '../../terraform/core';
import { ConfigurationService } from '../../configuration.service';
import { Job } from 'bull';

@Injectable()
export class PlanConsulHandler {
  private readonly logger = new Logger(PlanConsulHandler.name);
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformStateService: TerraformStateService,
    private terraform: Terraform
  ) {}

  async execute(job: Job<PlanConsulCommand>, command: PlanConsulCommand) {
    this.logger.debug(`Received PlanConsulCommand: ${command.consul.code}`);
    job.log(`Received PlanConsulCommand: ${command.consul.code}`);
    job.progress(5);
    return new Promise<any>((resolve, reject) => {
      this.terraform.executeInTerraformModuleDir(
        command.consul.code,
        command.cloudprovider,
        'consul',
        command.cloudConfig,
        async (workingDir) => {
          try {
            const rawProjectState = await firstValueFrom(
              this.terraformStateService.findState(
                command.consul.project.code.toLowerCase(),
                'project_base'
              )
            );
            this.terraform.addTerraformConsulModuleFile(
              command.consul,
              command.consul,
              command.cloudConfig,
              workingDir
            );

            this.terraform.addSshViaBastionConfigFileToModule(
              command.consul.project.cloud_provider.cloud,
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
              `dinivas-project-${command.consul.project.code.toLowerCase()}`,
              `consul/${command.consul.code.toLowerCase()}`
            );
            const result = {
              module: 'consul',
              eventCode: `planEvent-${command.consul.code}`,
              event: {
                source: command.consul,
                planResult,
              } as TerraformPlanEvent<ConsulDTO>,
            };
            job.progress(100);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
