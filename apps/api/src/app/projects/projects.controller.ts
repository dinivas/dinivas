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
  ICloudApiFlavor
} from '@dinivas/dto';
import { AuthzGuard } from '../auth/authz.guard';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
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
  HttpCode
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApplyProjectCommand } from './commands/impl/apply-project.command';

const YAML = require('js-yaml');

@ApiUseTags('Projects')
@Controller('projects')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly terraformStateService: TerraformStateService,
    private readonly cloudproviderService: CloudproviderService,
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
      route: 'http://cats.com/cats'
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
  create(@Body() project: ProjectDTO): Promise<ProjectDTO> {
    return this.projectsService.create(project);
  }

  @Post('plan')
  @Permissions('projects:create')
  async planproject(@Body() project: ProjectDTO): Promise<ProjectDTO> {
    const cloudprovider = await this.cloudproviderService.findOne(
      project.cloud_provider.id, true
    );
    return this.commandBus.execute(
      new PlanProjectCommand(
        project,
        project.name,
        project.code,
        project.description,
        project.public_router,
        project.floating_ip_pool,
        project.monitoring,
        project.logging,
        project.logging_stack,
        YAML.safeLoad(cloudprovider.config)
      )
    );
  }

  @Post('apply-plan')
  @HttpCode(202)
  @Permissions('projects:create')
  async applyProject(@Body() applyProject: ApplyModuleDTO<ProjectDTO>) {
    this.commandBus.execute(
      new ApplyProjectCommand(applyProject.source, applyProject.workingDir)
    );
  }

  @Put(':id')
  @Permissions('projects:edit')
  async update(
    @Param('id') id: number,
    @Body() project: ProjectDTO
  ): Promise<ProjectDTO> {
    this.logger.debug(`Updating project ${project.id} ${project.name}`);
    return await this.projectsService.update(id, project);
  }

  @Delete(':id')
  @Permissions('projects:delete')
  async remove(@Param('id') id: number) {
    const project = await this.projectsService.findOne(id);
    if (project) {
      const cloudprovider = await this.cloudproviderService.findOne(
        project.cloud_provider.id,true
      );
      this.commandBus.execute(
        new DestroyProjectCommand(project, YAML.safeLoad(cloudprovider.config))
      );
    }
  }
}
