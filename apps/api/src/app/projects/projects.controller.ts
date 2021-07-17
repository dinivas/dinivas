import { ConsulService } from './../network/consul/consul.service';
import { TerraformStateService } from './../terraform/terraform-state/terraform-state.service';
import { DestroyProjectCommand } from './commands/impl/destroy-project.command';
import { CloudproviderService } from './../cloudprovider/cloudprovider.service';
import { PlanProjectCommand } from './commands/impl/plan-project.command';
import { Permissions } from './../auth/permissions.decorator';
import {
  Pagination,
  ProjectDTO,
  ICloudApiProjectQuota,
  ApplyModuleDTO,
  ICloudApiImage,
  ICloudApiFlavor,
  ConsulDTO,
  ProjectDefinitionDTO,
  CloudproviderDTO,
} from '@dinivas/api-interfaces';
import { AuthzGuard } from '../auth/authz.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import {
  Controller,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
  Body,
  Post,
  Query,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApplyProjectCommand } from './commands/impl/apply-project.command';

import YAML = require('js-yaml');
import { TerraformService } from '../terraform/terraform.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@ApiTags('Projects')
@Controller('projects')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly consulService: ConsulService,
    private readonly terraformStateService: TerraformStateService,
    private readonly cloudproviderService: CloudproviderService,
    private readonly terraformService: TerraformService,
    @InjectQueue('terraform-module')
    private readonly terraformModuleQueue: Queue,
    private readonly commandBus: CommandBus
  ) {}

  @Get()
  @Permissions('projects:list')
  async findAll(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'id,desc'
  ): Promise<Pagination<ProjectDTO>> {
    return this.projectsService.findAll({
      page,
      limit,
      sort,
      route: 'http://cats.com/cats',
    });
  }

  @Get(':id')
  @Permissions('projects:view')
  async findOne(@Param('id') id: number): Promise<ProjectDTO> {
    return this.projectsService.findOne(id);
  }

  @Get(':id/flavors')
  @Permissions('projects:view')
  async allFlavors(@Param('id') id: number): Promise<ICloudApiFlavor[]> {
    const project = await this.projectsService.findOne(id);
    return this.cloudproviderService.getCloudProviderFlavors(
      project.cloud_provider.id
    );
  }

  @Get(':id/images')
  @Permissions('projects:view')
  async allImages(@Param('id') id: number): Promise<ICloudApiImage[]> {
    const project = await this.projectsService.findOne(id);
    return this.cloudproviderService.getCloudProviderImages(
      project.cloud_provider.id
    );
  }

  @Get(':id/quota')
  @Permissions('projects:view')
  async projectQuota(@Param('id') id: number): Promise<ICloudApiProjectQuota> {
    return this.projectsService.getProjectQuota(id);
  }

  @Get(':id/terraform_state')
  @Permissions('projects:view')
  async projectTerraformState(@Param('id') id: number): Promise<any> {
    const project = await this.projectsService.findOne(id);
    if (project) {
      const state = await this.terraformStateService.findState(
        project.code.toLowerCase(),
        'project_base'
      );
      return JSON.parse(state.state);
    }
  }

  @Post()
  @Permissions('projects:create')
  create(
    @Body() projectDefinition: ProjectDefinitionDTO
  ): Promise<ProjectDefinitionDTO> {
    return this.projectsService.create(projectDefinition);
  }

  @Post('plan')
  @Permissions('projects:create')
  async planproject(
    @Body() projectDefinition: ProjectDefinitionDTO
  ): Promise<ProjectDTO> {
    const project = projectDefinition.project;
    const cloudprovider: CloudproviderDTO =
      await this.cloudproviderService.findOne(project.cloud_provider.id, true);
    const cloudConfig = YAML.load(cloudprovider.config);
    this.terraformService.plan<ProjectDTO>(
      {
        projectCode: project.code,
        cloudprovider: cloudprovider.cloud,
        moduleName: 'project_base',
        cloudConfig,
      },
      project
    );
    const planJob = await this.terraformModuleQueue.add('plan', {
      options: {
        projectCode: project.code,
        cloudprovider: cloudprovider.cloud,
        moduleName: 'project_base',
        cloudConfig,
      },
      data: project,
    });
    this.logger.debug('Plan Job Id', JSON.stringify(planJob));
    return this.commandBus.execute(
      new PlanProjectCommand(
        cloudprovider.cloud,
        project,
        project.name,
        project.code,
        project.description,
        project.public_router,
        project.floating_ip_pool,
        project.monitoring,
        project.logging,
        project.logging_stack,
        cloudConfig,
        projectDefinition.consul
      )
    );
  }

  @Post('apply-plan')
  @HttpCode(202)
  @Permissions('projects:create')
  async applyProject(
    @Body() applyProjectDefinition: ApplyModuleDTO<ProjectDefinitionDTO>
  ) {
    this.commandBus.execute(
      new ApplyProjectCommand(
        applyProjectDefinition.source.project.cloud_provider.cloud,
        applyProjectDefinition.source.project,
        applyProjectDefinition.source.consul,
        applyProjectDefinition.workingDir
      )
    );
  }

  @Put(':id')
  @Permissions('projects:edit')
  async update(
    @Param('id') id: number,
    @Body() projectDefinition: ProjectDefinitionDTO
  ): Promise<ProjectDefinitionDTO> {
    this.logger.debug(
      `Updating project ${projectDefinition.project.id} ${projectDefinition.project.name}`
    );
    return await this.projectsService.update(projectDefinition);
  }

  @Delete(':id')
  @Permissions('projects:delete')
  async remove(@Param('id') id: number) {
    //TODO rachide: find project consul
    const project = await this.projectsService.findOne(id);
    if (project) {
      const cloudprovider = await this.cloudproviderService.findOne(
        project.cloud_provider.id,
        true
      );
      const consul: ConsulDTO = await this.consulService.findOneByCode(
        project.code
      );
      this.commandBus.execute(
        new DestroyProjectCommand(
          cloudprovider.cloud,
          project,
          consul,
          YAML.load(cloudprovider.config)
        )
      );
    }
  }
}
