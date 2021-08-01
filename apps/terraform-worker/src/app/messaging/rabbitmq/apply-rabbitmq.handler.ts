/* eslint-disable no-async-promise-executor */
import { ConfigurationService } from '../../configuration.service';
import { Terraform } from '../../terraform/core/Terraform';
import { Injectable, Logger } from '@nestjs/common';
import {
  TFStateRepresentation,
  TerraformApplyEvent,
  RabbitMQDTO,
  ApplyRabbitMQCommand,
} from '@dinivas/api-interfaces';
import { WSGateway } from '../../wsgateway';
import { Job } from 'bull';

@Injectable()
export class ApplyRabbitMQHandler
{
  private readonly logger = new Logger(ApplyRabbitMQCommand.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformGateway: WSGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(job: Job<ApplyRabbitMQCommand>,command: ApplyRabbitMQCommand) {
    return new Promise<any>(async (resolve, reject) => {
      this.logger.debug(
        `Received ApplyRabbitMQCommand: ${command.rabbitmq.code}`
      );
      try {
        job.progress(20);
        const stateResult: TFStateRepresentation = await this.terraform.apply(
          command.workingDir,
          ['-auto-approve', '"last-plan"'],
          { autoApprove: true, silent: !this.configService.getOrElse(
            'terraform.apply.verbose',
            false
          ) }
        );
        const result = {
          module: 'rabbitmq',
          eventCode: `applyEvent-${command.rabbitmq.code}`,
          event: {
            source: command.rabbitmq,
            stateResult,
          } as TerraformApplyEvent<RabbitMQDTO>,
        };
        job.progress(100);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
}
