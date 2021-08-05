import { JenkinsService } from './jenkins.service';
import {
  BULL_TERRAFORM_MODULE_QUEUE,
  JenkinsDTO,
  TerraformModule,
  TerraformModuleEvent,
} from '@dinivas/api-interfaces';
import { InjectQueue, OnGlobalQueueCompleted, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Queue } from 'bull';

@Processor(BULL_TERRAFORM_MODULE_QUEUE)
export class JenkinsTerraformTasksProcessor {
  private readonly logger = new Logger(JenkinsTerraformTasksProcessor.name);
  constructor(
    @InjectQueue(BULL_TERRAFORM_MODULE_QUEUE)
    private readonly terraformModuleQueue: Queue,
    private readonly jenkinsService: JenkinsService
  ) {}

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, receivedResult: any) {
    // Received result is in string
    const result: {
      module: TerraformModule;
      eventCode: string;
      event: TerraformModuleEvent<JenkinsDTO>;
    } = JSON.parse(receivedResult);
    if ('jenkins' === result.module) {
      if (result.eventCode.startsWith('destroyEvent-')) {
        await this.handleDeleteJenkinsEvent(result, jobId);
      } else if (result.eventCode.startsWith('applyEvent-')) {
        await this.handleCreateOrUpdateJenkinsEvent(result, jobId);
      }
    }
  }

  private async handleCreateOrUpdateJenkinsEvent(
    result: {
      module: TerraformModule;
      eventCode: string;
      event: TerraformModuleEvent<JenkinsDTO>;
    },
    jobId: number
  ) {
    const job = await this.terraformModuleQueue.getJob(jobId);
    this.logger.debug(
      `[APPLY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${result.event.source}]`
    );
    if (!result.event.source.data.id) {
      await this.jenkinsService.create(result.event.source.data);
    } else {
      await this.jenkinsService.update(
        result.event.source.data.id,
        result.event.source.data
      );
    }
  }
  private async handleDeleteJenkinsEvent(
    result: {
      module: string;
      eventCode: string;
      event: TerraformModuleEvent<JenkinsDTO>;
    },
    jobId: number
  ) {
    const destroyEvent = result.event;
    const job = await this.terraformModuleQueue.getJob(jobId);
    this.logger.debug(
      `[DESTROY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${destroyEvent.source}]`
    );
    await this.jenkinsService.delete(destroyEvent.source.data.id);
  }
}
