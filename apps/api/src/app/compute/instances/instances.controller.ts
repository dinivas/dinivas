import { DestroyInstanceCommand } from './commands/impl/destroy-instance.command';
import { ApplyInstanceCommand } from './commands/impl/apply-instance.command';
import { PlanInstanceCommand } from './commands/impl/plan-instance.command';
import { CommandBus } from '@nestjs/cqrs';
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
  HttpCode
} from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ICloudApiInstance,
  ProjectDTO,
  InstanceDTO,
  ConsulDTO,
  ApplyModuleDTO
} from '@dinivas/dto';
import { Request } from 'express';
const YAML = require('js-yaml');

@ApiUseTags('Compute instances')
@Controller('compute/instances')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class InstancesController {
  constructor(
    private readonly instancesService: InstancesService,
    private readonly consulService: ConsulService,
    private readonly terraformStateService: TerraformStateService,
    private readonly cloudproviderService: CloudproviderService,
    private readonly commandBus: CommandBus
  ) {}

  @Get()
  @Permissions('compute.instances:list')
  async findAll(@Req() request: Request): Promise<ICloudApiInstance[]> {
    const project = request['project'] as ProjectDTO;
    return this.instancesService.getInstances(project.cloud_provider.id);
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
  ): Promise<InstanceDTO> {
    const project = request['project'] as ProjectDTO;
    instance.project = project;
    const cloudprovider = await this.cloudproviderService.findOne(
      project.cloud_provider.id,
      true
    );
    const consul: ConsulDTO = await this.consulService.findOneByCode(
      project.code
    );
    return this.commandBus.execute(
      new PlanInstanceCommand(
        instance,
        consul,
        YAML.safeLoad(cloudprovider.config)
      )
    );
  }

  @Post('apply-plan')
  @HttpCode(202)
  @Permissions('compute.instances:create')
  async applyProject(@Body() applyProject: ApplyModuleDTO<InstanceDTO>) {
    this.commandBus.execute(
      new ApplyInstanceCommand(applyProject.source, applyProject.workingDir)
    );
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
        project.cloud_provider.id, true
      );
      const consul: ConsulDTO = await this.consulService.findOneByCode(
        project.code
      );
      this.commandBus.execute(
        new DestroyInstanceCommand(instance, consul, YAML.safeLoad(cloudprovider.config))
      );
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
