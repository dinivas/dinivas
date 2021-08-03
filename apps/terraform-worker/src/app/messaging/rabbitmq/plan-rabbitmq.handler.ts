import { TerraformStateService } from '../../terraform-state.service';
import { ConfigurationService } from '../../configuration.service';
import { Terraform } from '../../terraform/core/Terraform';
import { Injectable, Logger } from '@nestjs/common';

import {
  TerraformPlanEvent,
  TFPlanRepresentation,
  RabbitMQDTO,
  PlanRabbitMQCommand,
} from '@dinivas/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { Job } from 'bull';

@Injectable()
export class PlanRabbitMQHandler {
  private readonly logger = new Logger(PlanRabbitMQHandler.name);
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformStateService: TerraformStateService,
    private terraform: Terraform
  ) {}

  async execute(job: Job<PlanRabbitMQCommand>, command: PlanRabbitMQCommand) {
    this.logger.debug(`Received PlanRabbitMQCommand: ${command.rabbitmq.code}`);
    job.log(`Received PlanRabbitMQCommand: ${command.rabbitmq.code}`);
    job.progress(5);
    return new Promise<any>((resolve, reject) => {
      this.terraform.executeInTerraformModuleDir(
        command.rabbitmq.code,
        command.cloudprovider,
        'rabbitmq',
        command.cloudConfig,
        async (workingDir) => {
          try {
            const rawProjectState = await firstValueFrom(
              this.terraformStateService.findState(
                command.rabbitmq.project.code.toLowerCase(),
                'project_base'
              )
            );
            this.terraform.addTerraformRabbitMQModuleFile(
              command.rabbitmq,
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
              `dinivas-project-${command.rabbitmq.project.code.toLowerCase()}`,
              `rabbitmq/${command.rabbitmq.code.toLowerCase()}`
            );
            const result = {
              module: 'rabbitmq',
              eventCode: `planEvent-${command.rabbitmq.code}`,
              event: {
                source: command.rabbitmq,
                planResult,
              } as TerraformPlanEvent<RabbitMQDTO>,
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
