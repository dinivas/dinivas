import { RabbitMQService } from './rabbitmq.service';
import {
  BULL_TERRAFORM_MODULE_QUEUE,
  TerraformDestroyEvent,
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
    const result: { module: string; eventCode: string; event: any } =
      JSON.parse(receivedResult);
    if (
      'rabbitmq' === result.module &&
      result.eventCode.startsWith('destroyEvent-')
    ) {
      const destroyEvent = result.event as TerraformDestroyEvent<any>;
      const job = await this.terraformModuleQueue.getJob(jobId);
      this.logger.debug(
        `[DESTROY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${destroyEvent.source}]`
      );
      await this.rabbitMQService.delete(destroyEvent.source.id);
    }
  }
}
