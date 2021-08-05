import { ConsulService } from './../../network/consul/consul.service';
import { CloudproviderService } from './../../cloudprovider/cloudprovider.service';
import { TerraformStateService } from './../../terraform/terraform-state/terraform-state.service';
import { Permissions } from './../../auth/permissions.decorator';
import { InstancesService } from './instances.service';
import { AuthzGuard } from '../../auth/authz.guard';
import {
  Controller,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
  Body,
  Req,
  Post,
  HttpCode,
  Query,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ProjectDTO,
  InstanceDTO,
  ConsulDTO,
  ApplyModuleDTO,
  Pagination,
  CommonModuleCommand,
  CloudProviderId,
  BULL_TERRAFORM_MODULE_QUEUE,
  ICloudApiInstance,
} from '@dinivas/api-interfaces';
import { Request } from 'express';
import YAML = require('js-yaml');
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@ApiTags('Compute instances')
@Controller('compute/instances')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class InstancesController {
  private readonly logger = new Logger(InstancesController.name);
  constructor(
    private readonly instancesService: InstancesService,
    private readonly consulService: ConsulService,
    private readonly terraformStateService: TerraformStateService,
    private readonly cloudproviderService: CloudproviderService,
    @InjectQueue(BULL_TERRAFORM_MODULE_QUEUE)
    private readonly terraformModuleQueue: Queue
  ) {}

  @Get()
  @Permissions('compute.instances:list')
  async findAll(
    @Req() request: Request,
    @Query('page') page: number = 0,
    @Query('limit') limit = 10,
    @Query('sort') sort = 'id,desc'
  ): Promise<Pagination<ICloudApiInstance>> {
    const project = request['project'] as ProjectDTO;
    const instances = await this.instancesService.getInstances(
      project.cloud_provider.id
    );
    const dinivasInstances = (
      await this.instancesService.findAll({
        page,
        limit,
        sort,
        route: 'http://api/instances',
      })
    ).items;
    instances.forEach((cloudInstance) => {
      dinivasInstances.forEach((dinivasInstance) => {
        if (cloudInstance.name.startsWith(dinivasInstance.code)) {
          cloudInstance.techId = dinivasInstance.id;
        }
      });
    });
    return new Pagination(instances, instances.length, instances.length, page);
  }

  @Post()
  @Permissions('compute.instances:create')
  create(
    @Req() request: Request,
    @Body() instance: InstanceDTO
  ): Promise<InstanceDTO> {
    const project = request['project'] as ProjectDTO;
    instance.project = project;
    return this.instancesService.create(instance);
  }

  @Post('plan')
  @Permissions('compute.instances:create')
  async planproject(
    @Req() request: Request,
    @Body() instance: InstanceDTO
  ): Promise<{ planJobId: number | string }> {
    const project = request['project'] as ProjectDTO;
    instance.project = project;
    const cloudprovider = await this.cloudproviderService.findOne(
      project.cloud_provider.id,
      true
    );
    const consul: ConsulDTO = await this.consulService.findOneByCode(
      project.code
    );
    const planJob = await this.terraformModuleQueue.add(
      'plan',
      new CommonModuleCommand<InstanceDTO>(
        cloudprovider.cloud as CloudProviderId,
        'project_instance',
        instance.code,
        instance,
        project.code,
        project,
        consul,
        YAML.load(cloudprovider.config, { schema: YAML.FAILSAFE_SCHEMA })
      )
    );
    this.logger.debug(`Plan Job Id with datas: ${JSON.stringify(planJob)}`);
    return { planJobId: Number(planJob.id) };
  }

  @Post('apply-plan')
  @HttpCode(202)
  @Permissions('compute.instances:create')
  async applyProject(
    @Req() request: Request,
    @Body() applyProject: ApplyModuleDTO<InstanceDTO>
  ) {
    const project = request['project'] as ProjectDTO;
    applyProject.source.project = project;
    const cloudprovider = await this.cloudproviderService.findOne(
      project.cloud_provider.id,
      true
    );
    const cloudConfig = YAML.load(cloudprovider.config);
    const consul: ConsulDTO = await this.consulService.findOneByCode(
      project.code
    );
    const applyJob = await this.terraformModuleQueue.add(
      'apply',
      new CommonModuleCommand<InstanceDTO>(
        cloudprovider.cloud as CloudProviderId,
        'project_instance',
        applyProject.source.code,
        applyProject.source,
        project.code,
        project,
        consul,
        cloudConfig
      )
    );
    this.logger.debug(`Apply Job Id with datas: ${JSON.stringify(applyJob)}`);
    return { applyJobId: Number(applyJob.id) };
  }

  @Get(':id')
  @Permissions('compute.instances:view')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }
  @Put(':id')
  @Permissions('compute.instances:edit')
  update(@Param('id') id: string, @Body() updateCatDto: any) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  @Permissions('compute.instances:delete')
  async remove(@Param('id') id: number, @Req() request: Request) {
    const project = request['project'] as ProjectDTO;
    const instance = await this.instancesService.findOne(id);
    if (instance) {
      const cloudprovider = await this.cloudproviderService.findOne(
        project.cloud_provider.id,
        true
      );
      const consul: ConsulDTO = await this.consulService.findOneByCode(
        project.code
      );
      const destroyJob = await this.terraformModuleQueue.add(
        'destroy',
        new CommonModuleCommand<InstanceDTO>(
          cloudprovider.cloud as CloudProviderId,
          'project_instance',
          instance.code,
          instance,
          project.code,
          project,
          consul,
          YAML.load(cloudprovider.config, { schema: YAML.FAILSAFE_SCHEMA })
        )
      );
      this.logger.debug(
        `Destroy Job Id with data: ${JSON.stringify(destroyJob)}`
      );
      return { destroyJobId: Number(destroyJob.id) };
    }
  }

  @Get(':id/terraform_state')
  @Permissions('compute.instances:view')
  async instanceTerraformState(
    @Param('id') id: number,
    @Req() request: Request
  ): Promise<any> {
    const project = request['project'] as ProjectDTO;
    const instance = await this.instancesService.findOne(id);
    if (instance) {
      const state = await this.terraformStateService.findState(
        `${instance.code.toLowerCase()}`,
        'instance'
      );
      return JSON.parse(state.state);
    }
  }
}
