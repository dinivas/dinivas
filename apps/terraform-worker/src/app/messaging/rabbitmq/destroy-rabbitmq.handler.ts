/* eslint-disable no-async-promise-executor */
import { ConfigurationService } from '../../configuration.service';
import { Terraform } from '../../terraform/core/Terraform';
import { Injectable, Logger } from '@nestjs/common';
import {
  TerraformDestroyEvent,
  RabbitMQDTO,
  DestroyRabbitMQCommand,
} from '@dinivas/api-interfaces';
import { Job } from 'bull';

@Injectable()
export class DestroyRabbitMQHandler {
  private readonly logger = new Logger(DestroyRabbitMQHandler.name);
  constructor(
    private readonly configService: ConfigurationService,
    private terraform: Terraform
  ) {}

  async execute(
    job: Job<DestroyRabbitMQCommand>,
    command: DestroyRabbitMQCommand
  ) {
    return new Promise<any>(async (resolve, reject) => {
      this.logger.debug(
        `Received DestroyRabbitMQCommand: ${command.rabbitmq.code}`
      );
      job.progress(10);
      try {
        await this.terraform.destroy(
          ['-var-file=ssh-via-bastion.tfvars ', '-auto-approve'],
          {
            autoApprove: true,
            silent: !this.configService.getOrElse(
              'terraform.destroy.verbose',
              false
            ),
          },
          `dinivas-project-${command.rabbitmq.project.code.toLowerCase()}`,
          `rabbitmq/${command.rabbitmq.code.toLowerCase()}`
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
        job.log(error)
        reject(error);
      }
    });
  }
}
