/* eslint-disable no-async-promise-executor */
import { TerraformStateService } from '../../terraform-state.service';
import { WSGateway } from '../../wsgateway';
import { ConfigurationService } from '../../configuration.service';
import { Terraform } from '../../terraform/core/Terraform';
import { Injectable, Logger } from '@nestjs/common';
import {
  TerraformDestroyEvent,
  RabbitMQDTO,
  DestroyRabbitMQCommand,
} from '@dinivas/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { Job } from 'bull';

@Injectable()
export class DestroyRabbitMQHandler
{
  private readonly logger = new Logger(DestroyRabbitMQHandler.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformStateService: TerraformStateService,
    private readonly terraformGateway: WSGateway
  ) {
    this.terraform = new Terraform(this.configService);
  }

  async execute(job: Job<DestroyRabbitMQCommand>,command: DestroyRabbitMQCommand) {
    return new Promise<any>(async (resolve, reject) => {
      this.logger.debug(
        `Received DestroyRabbitMQCommand: ${command.rabbitmq.code}`
      );
      job.progress(10);
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
            rawProjectState,
            workingDir
          );
        },
        async (workingDir) => {
          try {
            await this.terraform.destroy(
              workingDir,
              [
                '-auto-approve',
                ...this.terraform.computeTerraformRabbitMQModuleVars(
                  command.rabbitmq,
                  command.consul,
                  command.cloudConfig
                ),
              ],
              {
                autoApprove: true,
                silent: !this.configService.getOrElse(
                  'terraform.destroy.verbose',
                  false
                ),
              }
            );
            const result = {
              module: 'rabbitmq',
              eventCode: `destroyEvent-${command.rabbitmq.code}`,
              event: {
                source: command.rabbitmq,
              } as TerraformDestroyEvent<RabbitMQDTO>,
            };
            job.progress(100);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }
}
