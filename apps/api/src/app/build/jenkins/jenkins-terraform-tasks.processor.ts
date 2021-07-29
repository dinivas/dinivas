import { JenkinsService } from './jenkins.service';
import {
  BULL_TERRAFORM_MODULE_QUEUE,
  JenkinsDTO,
  TerraformDestroyEvent,
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
      module: string;
      eventCode: string;
      event: { source: JenkinsDTO };
    } = JSON.parse(receivedResult);
    if (
      'jenkins' === result.module &&
      result.eventCode.startsWith('destroyEvent-')
    ) {
      const destroyEvent = result.event as TerraformDestroyEvent<JenkinsDTO>;
      const job = await this.terraformModuleQueue.getJob(jobId);
      this.logger.debug(
        `[DESTROY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${destroyEvent.source}]`
      );
      await this.jenkinsService.delete(destroyEvent.source.id);
    }
  }
}
