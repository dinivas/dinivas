import { RabbitMQService } from './rabbitmq.service';
import {
  BULL_TERRAFORM_MODULE_QUEUE,
  TerraformModule,
  RabbitMQDTO,
  TerraformModuleEvent,
} from '@dinivas/api-interfaces';
import { InjectQueue, OnGlobalQueueCompleted, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Queue } from 'bull';

@Processor(BULL_TERRAFORM_MODULE_QUEUE)
export class RabbitMQTerraformTasksProcessor {
  private readonly logger = new Logger(RabbitMQTerraformTasksProcessor.name);
  constructor(
    @InjectQueue(BULL_TERRAFORM_MODULE_QUEUE)
    private readonly terraformModuleQueue: Queue,
    private readonly rabbitMQService: RabbitMQService
  ) {}

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, receivedResult: any) {
    // Received result is in string
    const result: {
      module: TerraformModule;
      eventCode: string;
      event: TerraformModuleEvent<RabbitMQDTO>;
    } = JSON.parse(receivedResult);
    if ('rabbitmq' === result.module) {
      if (result.eventCode.startsWith('destroyEvent-')) {
        await this.handleDeleteRabbitMQEvent(result, jobId);
      } else if (result.eventCode.startsWith('applyEvent-')) {
        await this.handleCreateOrUpdateRabbitMQEvent(result, jobId);
      }
    }
  }

  private async handleCreateOrUpdateRabbitMQEvent(
    result: {
      module: TerraformModule;
      eventCode: string;
      event: TerraformModuleEvent<RabbitMQDTO>;
    },
    jobId: number
  ) {
    const job = await this.terraformModuleQueue.getJob(jobId);
    this.logger.debug(
      `[APPLY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${result.event.source}]`
    );
    if (!result.event.source.data.id) {
      await this.rabbitMQService.create(result.event.source.data);
    } else {
      await this.rabbitMQService.update(
        result.event.source.data.id,
        result.event.source.data
      );
    }
  }

  private async handleDeleteRabbitMQEvent(
    result: {
      module: string;
      eventCode: string;
      event: TerraformModuleEvent<RabbitMQDTO>;
    },
    jobId: number
  ) {
    const destroyEvent = result.event;
    const job = await this.terraformModuleQueue.getJob(jobId);
    this.logger.debug(
      `[DESTROY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${destroyEvent.source}]`
    );
    await this.rabbitMQService.delete(destroyEvent.source.data.id);
  }
}
