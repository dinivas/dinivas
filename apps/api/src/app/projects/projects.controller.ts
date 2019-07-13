import { Pagination, ProjectDTO } from '@dinivas/dto';
import { Roles } from './../auth/roles.decorator';
import { RolesGuard } from './../auth/roles.guard';
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
    Query
  } from '@nestjs/common';

@ApiUseTags('Projects')
@Controller('projects')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @Roles('admin')
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
  @Roles('admin')
  async findOne(@Param('id') id: number): Promise<ProjectDTO> {
    return this.projectsService.findOne(id);
  }

  @Post()
  @Roles('admin')
  async create(@Body() project: ProjectDTO) {
    await this.projectsService.create(project);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() project: ProjectDTO
  ) {
    await this.projectsService.update(id, project);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: number) {
    await this.projectsService.delete(id);
  }
}
