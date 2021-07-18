import { ConsulService } from '../../network/consul/consul.service';
import { CloudproviderService } from '../../cloudprovider/cloudprovider.service';
import { TerraformStateService } from '../../terraform/terraform-state/terraform-state.service';
import { Permissions } from '../../auth/permissions.decorator';
import { RabbitMQService } from './rabbitmq.service';
import { AuthzGuard } from '../../auth/authz.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller,
  UseGuards,
  Get,
  Query,
  Param,
  Post,
  Body,
  Delete,
  Req,
  HttpCode,
  Put,
  Logger,
} from '@nestjs/common';
import {
  Pagination,
  RabbitMQDTO,
  ProjectDTO,
  ApplyModuleDTO,
  ConsulDTO,
  PlanRabbitMQCommand,
  DestroyRabbitMQCommand,
  ApplyRabbitMQCommand,
  BULL_TERRAFORM_MODULE_QUEUE,
} from '@dinivas/api-interfaces';
import { Request } from 'express';
import YAML = require('js-yaml');
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@ApiTags('RabbitMQ')
@Controller('rabbitmq')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class RabbitMQController {
  private readonly logger = new Logger(RabbitMQController.name);

  constructor(
    private rabbitmqService: RabbitMQService,
    private readonly consulService: ConsulService,
    private readonly terraformStateService: TerraformStateService,
    private readonly cloudproviderService: CloudproviderService,
    @InjectQueue(BULL_TERRAFORM_MODULE_QUEUE)
    private readonly terraformModuleQueue: Queue
  ) {}

  @Get()
  @Permissions('rabbitmq:list')
  async findAll(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'id,desc'
  ): Promise<Pagination<RabbitMQDTO>> {
    return this.rabbitmqService.findAll({
      page,
      limit,
      sort,
      route: 'http://cats.com/cats',
    });
  }

  @Get(':id')
  @Permissions('rabbitmq:view')
  async findOne(@Param('id') id: number): Promise<RabbitMQDTO> {
    return this.rabbitmqService.findOne(id);
  }

  @Post()
  @Permissions('rabbitmq:create')
  create(
    @Req() request: Request,
    @Body() rabbitmq: RabbitMQDTO
  ): Promise<RabbitMQDTO> {
    const project = request['project'] as ProjectDTO;
    rabbitmq.project = project;
    return this.rabbitmqService.create(rabbitmq);
  }

  @Put(':id')
  @Permissions('rabbitmq:edit')
  async update(
    @Param('id') id: number,
    @Req() request: Request,
    @Body() rabbitmq: RabbitMQDTO
  ): Promise<RabbitMQDTO> {
    this.logger.debug(`Updating rabbitmq ${rabbitmq.id} ${rabbitmq.code}`);
    const project = request['project'] as ProjectDTO;
    rabbitmq.project = project;
    return await this.rabbitmqService.update(id, rabbitmq);
  }

  @Post('plan')
  @Permissions('rabbitmq:create')
  async planproject(
    @Req() request: Request,
    @Body() rabbitmq: RabbitMQDTO
  ): Promise<{ planJobId: number | string }> {
    const project = request['project'] as ProjectDTO;
    rabbitmq.project = project;
    const cloudprovider = await this.cloudproviderService.findOne(
      project.cloud_provider.id,
      true
    );
    const consul: ConsulDTO = await this.consulService.findOneByCode(
      project.code
    );
    const planJob = await this.terraformModuleQueue.add(
      'plan',
      new PlanRabbitMQCommand(
        cloudprovider.cloud,
        rabbitmq,
        consul,
        YAML.load(cloudprovider.config)
      )
    );
    this.logger.debug(`Plan Job Id with datas: ${JSON.stringify(planJob)}`);
    return { planJobId: planJob.id };
  }

  @Post('apply-plan')
  @HttpCode(202)
  @Permissions('rabbitmq:create')
  async applyProject(@Body() applyProject: ApplyModuleDTO<RabbitMQDTO>) {
    const applyJob = await this.terraformModuleQueue.add(
      'apply',
      new ApplyRabbitMQCommand(
        applyProject.source.project.cloud_provider.cloud,
        applyProject.source,
        applyProject.workingDir
      )
    );
    this.logger.debug('Apply Job Id', JSON.stringify(applyJob));
    return { applyJobId: applyJob.id };
  }

  @Get(':id/terraform_state')
  @Permissions('rabbitmq:view')
  async rabbitmqTerraformState(
    @Param('id') id: number,
    @Req() request: Request
  ): Promise<any> {
    const project = request['project'] as ProjectDTO;
    const rabbitmq = await this.rabbitmqService.findOne(id);
    if (rabbitmq) {
      const state = await this.terraformStateService.findState(
        `${rabbitmq.code.toLowerCase()}`,
        'rabbitmq'
      );
      return JSON.parse(state.state);
    }
  }

  @Delete(':id')
  @Permissions('rabbitmq:delete')
  async remove(@Param('id') id: number, @Req() request: Request) {
    const project = request['project'] as ProjectDTO;
    const rabbitmq = await this.rabbitmqService.findOne(id);
    if (rabbitmq) {
      const cloudprovider = await this.cloudproviderService.findOne(
        project.cloud_provider.id,
        true
      );
      const consul: ConsulDTO = await this.consulService.findOneByCode(
        project.code
      );
      const destroyJob = await this.terraformModuleQueue.add(
        'destroy',
        new DestroyRabbitMQCommand(
          cloudprovider.cloud,
          rabbitmq,
          consul,
          YAML.load(cloudprovider.config)
        )
      );
      this.logger.debug(`Destroy Job Id with data: ${JSON.stringify(destroyJob)}`);
      return { planJobId: destroyJob.id };
    }
  }
}
