import {
  BULL_TERRAFORM_MODULE_QUEUE,
  ConsulDTO,
  ProjectDTO,
  TerraformDestroyEvent,
} from '@dinivas/api-interfaces';
import { InjectQueue, OnGlobalQueueCompleted, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { ProjectsService } from './projects.service';
import { ConsulService } from '../network/consul/consul.service';

@Processor(BULL_TERRAFORM_MODULE_QUEUE)
export class ProjectTerraformTasksProcessor {
  private readonly logger = new Logger(ProjectTerraformTasksProcessor.name);
  constructor(
    @InjectQueue(BULL_TERRAFORM_MODULE_QUEUE)
    private readonly terraformModuleQueue: Queue,
    private readonly projectService: ProjectsService,
    private readonly consulService: ConsulService
  ) {}

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, receivedResult: any) {
    // Received result is in string
    const result: { module: string; eventCode: string; event: any } =
      JSON.parse(receivedResult);
    if (
      'project' === result.module &&
      result.eventCode.startsWith('destroyEvent-')
    ) {
      const destroyEvent = result.event as TerraformDestroyEvent<any>;
      const job = await this.terraformModuleQueue.getJob(jobId);
      this.logger.debug(
        `[DESTROY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${destroyEvent.source}]`
      );
      await this.consulService.delete(
        (
          destroyEvent.source as {
            project: ProjectDTO;
            consul: ConsulDTO;
          }
        ).consul.id
      );
      await this.projectService.delete(
        (
          destroyEvent.source as {
            project: ProjectDTO;
            consul: ConsulDTO;
          }
        ).project.id
      );
    }
  }
}
