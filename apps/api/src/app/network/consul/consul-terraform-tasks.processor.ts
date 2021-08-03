import { ConsulService } from './consul.service';
import {
  BULL_TERRAFORM_MODULE_QUEUE,
  ConsulDTO,
  TerraformDestroyEvent,
} from '@dinivas/api-interfaces';
import { InjectQueue, OnGlobalQueueCompleted, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Queue } from 'bull';

@Processor(BULL_TERRAFORM_MODULE_QUEUE)
export class ConsulTerraformTasksProcessor {
  private readonly logger = new Logger(ConsulTerraformTasksProcessor.name);
  constructor(
    @InjectQueue(BULL_TERRAFORM_MODULE_QUEUE)
    private readonly terraformModuleQueue: Queue,
    private readonly consulService: ConsulService
  ) {}

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, receivedResult: any) {
    // Received result is in string
    const result: {
      module: string;
      eventCode: string;
      event: { source: ConsulDTO };
    } = JSON.parse(receivedResult);
    if (
      'consul' === result.module &&
      result.eventCode.startsWith('destroyEvent-')
    ) {
      const destroyEvent = result.event as TerraformDestroyEvent<ConsulDTO>;
      const job = await this.terraformModuleQueue.getJob(jobId);
      this.logger.debug(
        `[DESTROY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${destroyEvent.source}]`
      );
      await this.consulService.delete(destroyEvent.source.id);
    }
  }
}
