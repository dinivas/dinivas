import {
  BULL_TERRAFORM_MODULE_QUEUE,
  TerraformModuleEvent,
} from '@dinivas/api-interfaces';
import {
  InjectQueue,
  OnGlobalQueueActive,
  OnGlobalQueueCompleted,
  OnGlobalQueueFailed,
  OnGlobalQueueProgress,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { CoreWebSocketGateway } from '../core/core-websocket.gateway';
import { Job, Queue } from 'bull';

@Processor(BULL_TERRAFORM_MODULE_QUEUE)
export class TerraformTasksProcessor {
  private readonly logger = new Logger(TerraformTasksProcessor.name);
  constructor(
    @InjectQueue(BULL_TERRAFORM_MODULE_QUEUE)
    private readonly terraformModuleQueue: Queue,
    private readonly coreWebSocketGateway: CoreWebSocketGateway
  ) {}

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, receivedResult: any) {
    // Received result is in string
    const result: {
      module: string;
      eventCode: string;
      event: TerraformModuleEvent<any>;
    } = JSON.parse(receivedResult);
    if (result.eventCode.startsWith('planEvent-')) {
      const planEvent = result.event;
      const job = await this.terraformModuleQueue.getJob(jobId);
      this.logger.debug(
        `[PLAN] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode} -> result source [${planEvent.source}], planResult: ( Nb resources changed: [${planEvent.planResult.resource_changes.length}], Planned Values: [${planEvent.planResult.planned_values.outputs}])`
      );
      this.coreWebSocketGateway.emit(result.eventCode, planEvent);
    }
    if (result.eventCode.startsWith('applyEvent-')) {
      const applyEvent = result.event;
      const job = await this.terraformModuleQueue.getJob(jobId);
      this.logger.debug(
        `[APPLY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode} -> result  source [${applyEvent.source}], planResult: ( Plan Values: [${applyEvent.stateResult.values.outputs}])`
      );
      this.coreWebSocketGateway.emit(result.eventCode, applyEvent);
    }
    if (result.eventCode.startsWith('destroyEvent-')) {
      const destroyEvent = result.event;
      const job = await this.terraformModuleQueue.getJob(jobId);
      this.logger.debug(
        `[DESTROY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${destroyEvent.source}]`
      );
      this.coreWebSocketGateway.emit(result.eventCode, destroyEvent);
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
  @OnGlobalQueueProgress()
  async onGlobalQueueProgress(job: Job, progress: number) {
    this.logger.debug(`The job ${Number(job)} progress changed => ${progress}`);
    this.coreWebSocketGateway.emit('background-job-progress', {
      jobId: Number(job),
      progress,
    });
  }
  @OnGlobalQueueFailed()
  async onGlobalQueueFailed(job: Job, err: Error) {
    this.logger.debug(
      `A job has failed => ${JSON.stringify(job)} with Error: ${err}`
    );
    //const jobInError = await this.terraformModuleQueue.getJob(job.id);
    this.coreWebSocketGateway.emit('background-job-failed', {
      jobId: JSON.parse(JSON.stringify(job)),
      error: err,
    });
  }
}
