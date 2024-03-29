import {
  BULL_TERRAFORM_MODULE_QUEUE,
  TerraformModule,
  ProjectDefinitionDTO,
  TerraformModuleEvent,
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
    const result: {
      module: TerraformModule;
      eventCode: string;
      event: TerraformModuleEvent<ProjectDefinitionDTO>;
    } = JSON.parse(receivedResult);
    if ('project_base' === result.module) {
      if (result.eventCode.startsWith('destroyEvent-')) {
        await this.handleDeleteProjectEvent(result, jobId);
      } else if (result.eventCode.startsWith('applyEvent-')) {
        await this.handleCreateOrUpdateProjectEvent(result, jobId);
      }
    }
  }

  private async handleCreateOrUpdateProjectEvent(
    result: {
      module: TerraformModule;
      eventCode: string;
      event: TerraformModuleEvent<ProjectDefinitionDTO>;
    },
    jobId: number
  ) {
    const job = await this.terraformModuleQueue.getJob(jobId);
    this.logger.debug(
      `[APPLY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${result.event.source}]`
    );
    if (!result.event.source.project.id) {
      await this.projectService.create(result.event.source.data);
    } else {
      await this.projectService.update(result.event.source.data);
    }
  }
  private async handleDeleteProjectEvent(
    result: {
      module: TerraformModule;
      eventCode: string;
      event: TerraformModuleEvent<ProjectDefinitionDTO>;
    },
    jobId: number
  ) {
    const destroyEvent = result.event;
    const job = await this.terraformModuleQueue.getJob(jobId);
    this.logger.debug(
      `[DESTROY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode}, module: ${result.module} -> result  source [${destroyEvent.source}]`
    );
    await this.consulService.delete(result.event.source.consul.id);
    await this.projectService.delete(result.event.source.project.id);
  }
}
