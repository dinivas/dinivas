import { ConsulService } from './../network/consul/consul.service';
import { TerraformStateService } from './../terraform/terraform-state/terraform-state.service';
import { CloudproviderService } from './../cloudprovider/cloudprovider.service';
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
  CommonModuleCommand,
  BULL_TERRAFORM_MODULE_QUEUE,
  CloudProviderId,
  ICloudApiKeyPair,
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
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';

import YAML = require('js-yaml');
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
    @InjectQueue(BULL_TERRAFORM_MODULE_QUEUE)
    private readonly terraformModuleQueue: Queue
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
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProjectDTO> {
    return this.projectsService.findOne(id);
  }

  @Get(':id/flavors')
  @Permissions('projects:view')
  async allFlavors(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ICloudApiFlavor[]> {
    const project = await this.projectsService.findOne(id);
    return this.cloudproviderService.getCloudProviderFlavors(
      project.cloud_provider.id
    );
  }
  @Get(':id/keypairs')
  @Permissions('projects:view')
  async allKeyPairs(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ICloudApiKeyPair[]> {
    const project = await this.projectsService.findOne(id);
    return this.cloudproviderService.getCloudProviderKeyPairs(
      project.cloud_provider.id
    );
  }

  @Get(':id/images')
  @Permissions('projects:view')
  async allImages(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ICloudApiImage[]> {
    const project = await this.projectsService.findOne(id);
    return this.cloudproviderService.getCloudProviderImages(
      project.cloud_provider.id
    );
  }

  @Get(':id/quota')
  @Permissions('projects:view')
  async projectQuota(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ICloudApiProjectQuota> {
    return this.projectsService.getProjectQuota(id);
  }

  @Get(':id/terraform_state')
  @Permissions('projects:view')
  async projectTerraformState(
    @Param('id', ParseIntPipe) id: number
  ): Promise<any> {
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

  @Get(':id/ssh-terminal-token')
  @Permissions('projects:create')
  async getProjectGuacamoleSSHToken(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ token: string }> {
    const project = await this.projectsService.findOne(id);
    if (project) {
      const state = await this.terraformStateService.findState(
        project.code.toLowerCase(),
        'project_base'
      );
      const jsonState = JSON.parse(state.state);
      const token = this.projectsService.generateProjectGuacamoleToken(
        jsonState,
        project.cloud_provider.cloud
      );
      return { token };
    }
    throw new NotFoundException();
  }

  @Post('plan')
  @Permissions('projects:create')
  async planproject(
    @Body() projectDefinition: ProjectDefinitionDTO
  ): Promise<{ planJobId: number }> {
    const project = projectDefinition.project;
    const cloudprovider: CloudproviderDTO =
      await this.cloudproviderService.findOne(project.cloud_provider.id, true);
    const cloudConfig = YAML.load(cloudprovider.config);
    const planJob = await this.terraformModuleQueue.add(
      'plan',
      new CommonModuleCommand<ProjectDefinitionDTO>(
        cloudprovider.cloud as CloudProviderId,
        'project_base',
        project.code,
        projectDefinition,
        project.code,
        project,
        projectDefinition.consul,
        cloudConfig
      )
    );
    this.logger.debug(`Plan Job Id with datas: ${JSON.stringify(planJob)}`);
    return { planJobId: Number(planJob.id) };
  }

  @Post('apply-plan')
  @HttpCode(202)
  @Permissions('projects:create')
  async applyProject(
    @Body() applyProjectDefinition: ApplyModuleDTO<ProjectDefinitionDTO>
  ): Promise<{ applyJobId: number }> {
    const project = applyProjectDefinition.source.project;
    const cloudprovider: CloudproviderDTO =
      await this.cloudproviderService.findOne(project.cloud_provider.id, true);
    const cloudConfig = YAML.load(cloudprovider.config);
    const applyJob = await this.terraformModuleQueue.add(
      'apply',
      new CommonModuleCommand<ProjectDefinitionDTO>(
        applyProjectDefinition.source.project.cloud_provider
          .cloud as CloudProviderId,
        'project_base',
        applyProjectDefinition.source.project.code,
        applyProjectDefinition.source,
        applyProjectDefinition.source.project.code,
        applyProjectDefinition.source.project,
        applyProjectDefinition.source.consul,
        cloudConfig
      )
    );
    this.logger.debug(`Apply Job Id with data: ${JSON.stringify(applyJob)}`);
    return { applyJobId: Number(applyJob.id) };
  }

  @Put(':id')
  @Permissions('projects:edit')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() projectDefinition: ProjectDefinitionDTO
  ): Promise<ProjectDefinitionDTO> {
    this.logger.debug(
      `Updating project ${projectDefinition.project.id} ${projectDefinition.project.name}`
    );
    return await this.projectsService.update(projectDefinition);
  }

  @Delete(':id')
  @Permissions('projects:delete')
  async remove(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ destroyJobId: number }> {
    const project = await this.projectsService.findOne(id);
    if (project) {
      const cloudprovider = await this.cloudproviderService.findOne(
        project.cloud_provider.id,
        true
      );
      const consul: ConsulDTO = await this.consulService.findOneByCode(
        project.code
      );
      const destroyJob = await this.terraformModuleQueue.add(
        'destroy',
        new CommonModuleCommand<ProjectDefinitionDTO>(
          cloudprovider.cloud as CloudProviderId,
          'project_base',
          project.code,
          { project, consul },
          project.code,
          project,
          consul,
          YAML.load(cloudprovider.config)
        )
      );
      this.logger.debug(
        `Destroy Job Id with data: ${JSON.stringify(destroyJob)}`
      );
      return { destroyJobId: Number(destroyJob.id) };
    }
  }
}
