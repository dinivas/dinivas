import { AuthzGuard } from './../../auth/authz.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ConsulDTO,
  Pagination,
  ProjectDTO,
  ApplyModuleDTO,
  DestroyConsulCommand,
  PlanConsulCommand,
  ApplyConsulCommand,
  BULL_TERRAFORM_MODULE_QUEUE,
} from '@dinivas/api-interfaces';
import { Permissions } from './../../auth/permissions.decorator';
import { TerraformStateService } from './../../terraform/terraform-state/terraform-state.service';
import { CloudproviderService } from './../../cloudprovider/cloudprovider.service';
import { ConsulService } from './consul.service';
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
import { Request } from 'express';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import YAML = require('js-yaml');

@ApiTags('Consul')
@Controller('consul')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class ConsulController {
  private readonly logger = new Logger(ConsulController.name);

  constructor(
    private consulService: ConsulService,
    private readonly terraformStateService: TerraformStateService,
    private readonly cloudproviderService: CloudproviderService,
    @InjectQueue(BULL_TERRAFORM_MODULE_QUEUE)
    private readonly terraformModuleQueue: Queue
  ) {}

  @Get()
  @Permissions('consul:list')
  async findAll(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'id,desc'
  ): Promise<Pagination<ConsulDTO>> {
    return this.consulService.findAll({
      page,
      limit,
      sort,
      route: 'http://dinivas/consul',
    });
  }

  @Get(':id')
  @Permissions('consul:view')
  async findOne(@Param('id') id: number): Promise<ConsulDTO> {
    return this.consulService.findOne(id);
  }

  @Get('by_code/:code')
  @Permissions('consul:view')
  async findOneByCode(@Param('code') code: string): Promise<ConsulDTO> {
    return this.consulService.findOneByCode(code);
  }

  @Post()
  @Permissions('consul:create')
  create(
    @Req() request: Request,
    @Body() consul: ConsulDTO
  ): Promise<ConsulDTO> {
    const project = request['project'] as ProjectDTO;
    consul.project = project;
    return this.consulService.create(consul);
  }

  @Put(':id')
  @Permissions('consul:edit')
  async update(
    @Param('id') id: number,
    @Req() request: Request,
    @Body() consul: ConsulDTO
  ): Promise<ConsulDTO> {
    this.logger.debug(`Updating consul ${consul.id} ${consul.code}`);
    const project = request['project'] as ProjectDTO;
    consul.project = project;
    return await this.consulService.update(id, consul);
  }

  @Post('plan')
  @Permissions('consul:create')
  async planproject(
    @Req() request: Request,
    @Body() consul: ConsulDTO
  ): Promise<{ planJobId: number | string }> {
    const project = request['project'] as ProjectDTO;
    consul.project = project;
    const cloudprovider = await this.cloudproviderService.findOne(
      project.cloud_provider.id,
      true
    );
    const projectConsul: ConsulDTO = await this.consulService.findOneByCode(
      project.code
    );
    const planJob = await this.terraformModuleQueue.add(
      'plan-consul',
      new PlanConsulCommand(
        cloudprovider.cloud,
        consul,
        projectConsul,
        YAML.load(cloudprovider.config)
      )
    );
    this.logger.debug(`Plan Job Id with datas: ${JSON.stringify(planJob)}`);
    return { planJobId: Number(planJob.id) };
  }

  @Post('apply-plan')
  @HttpCode(202)
  @Permissions('consul:create')
  async applyProject(
    @Req() request: Request,
    @Body() applyProject: ApplyModuleDTO<ConsulDTO>
  ) {
    const project = request['project'] as ProjectDTO;
    applyProject.source.project = project;
    const cloudprovider = await this.cloudproviderService.findOne(
      project.cloud_provider.id,
      true
    );
    const applyJob = await this.terraformModuleQueue.add(
      'apply-consul',
      new ApplyConsulCommand(cloudprovider.cloud, applyProject.source)
    );
    this.logger.debug(`Apply Job Id with datas: ${JSON.stringify(applyJob)}`);
    return { applyJobId: Number(applyJob.id) };
  }

  @Get(':id/terraform_state')
  @Permissions('consul:view')
  async consulTerraformState(
    @Param('id') id: number,
    @Req() request: Request
  ): Promise<any> {
    const project = request['project'] as ProjectDTO;
    const consul = await this.consulService.findOne(id);
    if (consul) {
      const state = await this.terraformStateService.findState(
        `${consul.code.toLowerCase()}`,
        'consul'
      );
      return JSON.parse(state.state);
    }
  }

  @Delete(':id')
  @Permissions('consul:delete')
  async remove(@Param('id') id: number, @Req() request: Request) {
    const project = request['project'] as ProjectDTO;
    const consul = await this.consulService.findOne(id);
    if (consul) {
      const cloudprovider = await this.cloudproviderService.findOne(
        project.cloud_provider.id,
        true
      );
      const projectConsul: ConsulDTO = await this.consulService.findOneByCode(
        project.code
      );
      const destroyJob = await this.terraformModuleQueue.add(
        'destroy-consul',
        new DestroyConsulCommand(
          cloudprovider.cloud,
          consul,
          projectConsul,
          YAML.load(cloudprovider.config)
        )
      );
      this.logger.debug(
        `Destroy Job Id with datas: ${JSON.stringify(destroyJob)}`
      );
      return { destroyJobId: Number(destroyJob.id) };
    }
  }
}
