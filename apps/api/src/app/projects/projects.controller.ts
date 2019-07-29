import { CloudproviderService } from './../cloudprovider/cloudprovider.service';
import { PlanProjectCommand } from './commands/impl/plan-project.command';
import { Permissions } from './../auth/permissions.decorator';
import { Pagination, ProjectDTO, ICloudApiProjectQuota } from '@dinivas/dto';
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
  Logger
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import YAML from 'yaml';

@ApiUseTags('Projects')
@Controller('projects')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);
  constructor(
    private readonly projectsService: ProjectsService,
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

  @Get('quota/:id')
  @Permissions('projects:view')
  async projectQuota(@Param('id') id: number): Promise<ICloudApiProjectQuota> {
    return this.projectsService.getProjectQuota(id);
  }

  @Post()
  @Permissions('projects:create')
  create(@Body() project: ProjectDTO): Promise<ProjectDTO> {
    return this.projectsService.create(project);
  }

  @Post('plan')
  @Permissions('projects:create')
  async planproject(@Body() project: ProjectDTO): Promise<ProjectDTO> {
    const cloudprovider = await this.cloudproviderService.findOne(project.cloud_provider.id);
    return this.commandBus.execute(
      new PlanProjectCommand(
        project.name,
        project.code,
        project.description,
        project.monitoring,
        project.logging,
        project.logging_stack,
        'public',
        YAML.parse(cloudprovider.config)
      )
    );
  }

  @Put(':id')
  @Permissions('projects:edit')
  async update(@Param('id') id: number, @Body() project: ProjectDTO) {
    this.logger.debug(`Updating project ${project.id} ${project.name}`);
    await this.projectsService.update(id, project);
  }

  @Delete(':id')
  @Permissions('projects:delete')
  async remove(@Param('id') id: number) {
    await this.projectsService.delete(id);
  }
}
