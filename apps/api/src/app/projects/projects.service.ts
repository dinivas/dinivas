import { ConfigService } from './../core/config/config.service';
import { CloudApiFactory } from './../core/cloudapi/cloudapi.factory';
import { CloudproviderService } from './../cloudprovider/cloudprovider.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProjectDTO,
  paginate,
  IPaginationOptions,
  Pagination,
  ICloudApiProjectQuota
} from '@dinivas/dto';
import { Project } from './project.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private cloudApiFactory: CloudApiFactory
  ) {}

  async findAll(
    paginationOption: IPaginationOptions
  ): Promise<Pagination<ProjectDTO>> {
    return await paginate<Project>(
      this.projectRepository,
      paginationOption,
      ProjectsService.toDTO,
      { relations: ['cloud_provider'] }
    );
  }

  async findOne(id: number): Promise<Project> {
    const project: Project = await this.projectRepository.findOne(id, {
      relations: ['cloud_provider']
    });
    if (!project) {
      throw new NotFoundException(`Project with id: ${id} not found`);
    }
    return ProjectsService.toDTO(project);
  }

  async getProjectQuota(id: number): Promise<ICloudApiProjectQuota> {
    const project: Project = await this.projectRepository.findOne(id, {
      relations: ['cloud_provider']
    });
    const cloudApi = this.cloudApiFactory.getCloudApiService(
      project.cloud_provider.cloud
    );
    return cloudApi.getProjectQuota(
      this.cloudApiFactory.getCloudApiConfig(
        project.cloud_provider.cloud,
        project.cloud_provider.config
      )
    );
  }

  async create(projectDTO: ProjectDTO): Promise<ProjectDTO> {
    const project: ProjectDTO = ProjectsService.toDTO(
      await this.projectRepository.save(projectDTO as Project)
    );
    return project;
  }

  async update(id: number, projectDTO: ProjectDTO) {
    return await this.projectRepository.save(projectDTO as Project);
  }

  async delete(id: number) {
    await this.projectRepository.delete(id);
  }

  static toDTO = (project: Project): ProjectDTO => {
    const projectDTO: ProjectDTO = new ProjectDTO();
    projectDTO.id = project.id;
    projectDTO.name = project.name;
    projectDTO.code = project.code;
    projectDTO.description = project.description;
    projectDTO.monitoring = project.monitoring;
    projectDTO.logging = project.logging;
    projectDTO.logging_stack = project.logging_stack;
    projectDTO.cloud_provider = CloudproviderService.toDTO(
      project.cloud_provider
    );
    return projectDTO;
  };
}
