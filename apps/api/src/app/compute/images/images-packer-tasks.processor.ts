import { BULL_PACKER_BUILD_QUEUE } from '@dinivas/api-interfaces';
import {
  InjectQueue,
  OnGlobalQueueActive,
  OnGlobalQueueCompleted,
  OnGlobalQueueFailed,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { CoreWebSocketGateway } from '../../core/core-websocket.gateway';
import { Job, Queue } from 'bull';

@Processor(BULL_PACKER_BUILD_QUEUE)
export class ImagesPackerTasksProcessor {
  private readonly logger = new Logger(ImagesPackerTasksProcessor.name);
  constructor(
    @InjectQueue(BULL_PACKER_BUILD_QUEUE)
    private readonly packerBuildQueue: Queue,
    private readonly coreWebSocketGateway: CoreWebSocketGateway
  ) {}

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, receivedResult: any) {
    // Received result is in string
    if (receivedResult != null) {
      const result: { eventCode: string; event: any } =
        JSON.parse(receivedResult);
      if (result.eventCode.startsWith('build')) {
        const job = await this.packerBuildQueue.getJob(jobId);
        this.logger.debug(
          `[BUILD] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}`
        );
      }
    }
    this.coreWebSocketGateway.emit('background-job-completed', {
      jobId,
      event: receivedResult,
    });
  }

  @OnGlobalQueueActive()
  async onGlobalQueueActive(job: Job) {
    this.logger.debug(`A job has started => ${JSON.stringify(job)}`);
    this.coreWebSocketGateway.emit('background-job-start', job);
  }
  @OnGlobalQueueFailed()
  async onGlobalQueueFailed(job: Job, err: Error) {
    this.logger.debug(
      `A job has failed => ${JSON.stringify(job)} wit Error: ${err}`
    );
    this.coreWebSocketGateway.emit('background-job-failed', {
      jobId: job.id,
      event: err,
    });
  }
}
