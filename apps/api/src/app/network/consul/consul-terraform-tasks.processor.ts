import { ConsulService } from './consul.service';
import {
  BULL_TERRAFORM_MODULE_QUEUE,
  ConsulDTO,
  TerraformModuleEvent,
  TerraformModule,
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
      module: TerraformModule;
      eventCode: string;
      event: TerraformModuleEvent<ConsulDTO>;
    } = JSON.parse(receivedResult);
    if ('consul' === result.module) {
      if (result.eventCode.startsWith('destroyEvent-')) {
        await this.handleDeleteConsulEvent(result, jobId);
      } else if (result.eventCode.startsWith('applyEvent-')) {
        await this.handleCreateOrUpdateConsulEvent(result, jobId);
      }
    }
  }

  private async handleCreateOrUpdateConsulEvent(
    result: {
      module: TerraformModule;
      eventCode: string;
      event: TerraformModuleEvent<ConsulDTO>;
    },
    jobId: number
  ) {
    const job = await this.terraformModuleQueue.getJob(jobId);
    this.logger.debug(
      `[APPLY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${result.event.source}]`
    );
    if (!result.event.source.data.id) {
      await this.consulService.create(result.event.source.data);
    } else {
      await this.consulService.update(
        result.event.source.data.id,
        result.event.source.data
      );
    }
  }

  private async handleDeleteConsulEvent(
    result: {
      module: string;
      eventCode: string;
      event: TerraformModuleEvent<ConsulDTO>;
    },
    jobId: number
  ) {
    const destroyEvent = result.event;
    const job = await this.terraformModuleQueue.getJob(jobId);
    this.logger.debug(
      `[DESTROY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${destroyEvent.source}]`
    );
    await this.consulService.delete(destroyEvent.source.data.id);
  }
}
