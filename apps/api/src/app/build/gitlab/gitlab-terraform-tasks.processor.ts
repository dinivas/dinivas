import { GitlabService } from './gitlab.service';
import {
  BULL_TERRAFORM_MODULE_QUEUE,
  GitlabDTO,
  TerraformModule,
  TerraformModuleEvent,
} from '@dinivas/api-interfaces';
import { InjectQueue, OnGlobalQueueCompleted, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Queue } from 'bull';

@Processor(BULL_TERRAFORM_MODULE_QUEUE)
export class GitlabTerraformTasksProcessor {
  private readonly logger = new Logger(GitlabTerraformTasksProcessor.name);
  constructor(
    @InjectQueue(BULL_TERRAFORM_MODULE_QUEUE)
    private readonly terraformModuleQueue: Queue,
    private readonly gitlabService: GitlabService
  ) {}

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, receivedResult: any) {
    // Received result is in string
    const result: {
      module: TerraformModule;
      eventCode: string;
      event: TerraformModuleEvent<GitlabDTO>;
    } = JSON.parse(receivedResult);
    if ('gitlab' === result.module) {
      if (result.eventCode.startsWith('destroyEvent-')) {
        await this.handleDeleteGitlabEvent(result, jobId);
      } else if (result.eventCode.startsWith('applyEvent-')) {
        await this.handleCreateOrUpdateGitlabEvent(result, jobId);
      }
    }
  }

  private async handleCreateOrUpdateGitlabEvent(
    result: {
      module: TerraformModule;
      eventCode: string;
      event: TerraformModuleEvent<GitlabDTO>;
    },
    jobId: number
  ) {
    const job = await this.terraformModuleQueue.getJob(jobId);
    this.logger.debug(
      `[APPLY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${result.event.source}]`
    );
    if (!result.event.source.data.id) {
      await this.gitlabService.create(result.event.source.data);
    } else {
      await this.gitlabService.update(
        result.event.source.data.id,
        result.event.source.data
      );
    }
  }
  private async handleDeleteGitlabEvent(
    result: {
      module: string;
      eventCode: string;
      event: TerraformModuleEvent<GitlabDTO>;
    },
    jobId: number
  ) {
    const destroyEvent = result.event;
    const job = await this.terraformModuleQueue.getJob(jobId);
    this.logger.debug(
      `[DESTROY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${destroyEvent.source}]`
    );
    await this.gitlabService.delete(destroyEvent.source.data.id);
  }
}
