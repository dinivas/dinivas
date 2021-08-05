import { InstancesService } from './instances.service';
import {
  BULL_TERRAFORM_MODULE_QUEUE,
  InstanceDTO,
  TerraformModule,
  TerraformModuleEvent,
} from '@dinivas/api-interfaces';
import { InjectQueue, OnGlobalQueueCompleted, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Queue } from 'bull';

@Processor(BULL_TERRAFORM_MODULE_QUEUE)
export class InstanceTerraformTasksProcessor {
  private readonly logger = new Logger(InstanceTerraformTasksProcessor.name);
  constructor(
    @InjectQueue(BULL_TERRAFORM_MODULE_QUEUE)
    private readonly terraformModuleQueue: Queue,
    private readonly instancesService: InstancesService
  ) {}

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, receivedResult: any) {
    // Received result is in string
    const result: {
      module: TerraformModule;
      eventCode: string;
      event: TerraformModuleEvent<InstanceDTO>;
    } = JSON.parse(receivedResult);
    if ('project_instance' === result.module) {
      if (result.eventCode.startsWith('destroyEvent-')) {
        await this.handleDeleteInstanceEvent(result, jobId);
      } else if (result.eventCode.startsWith('applyEvent-')) {
        await this.handleCreateOrUpdateInstanceEvent(result, jobId);
      }
    }
  }

  private async handleCreateOrUpdateInstanceEvent(
    result: {
      module: TerraformModule;
      eventCode: string;
      event: TerraformModuleEvent<InstanceDTO>;
    },
    jobId: number
  ) {
    const job = await this.terraformModuleQueue.getJob(jobId);
    this.logger.debug(
      `[APPLY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${result.event.source}]`
    );
    if (!result.event.source.data.id) {
      await this.instancesService.create(result.event.source.data);
    } else {
      await this.instancesService.update(
        result.event.source.data.id,
        result.event.source.data
      );
    }
  }
  private async handleDeleteInstanceEvent(
    result: {
      module: string;
      eventCode: string;
      event: TerraformModuleEvent<InstanceDTO>;
    },
    jobId: number
  ) {
    const destroyEvent = result.event;
    const job = await this.terraformModuleQueue.getJob(jobId);
    this.logger.debug(
      `[DESTROY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${destroyEvent.source}]`
    );
    await this.instancesService.delete(destroyEvent.source.data.id);
  }
}
