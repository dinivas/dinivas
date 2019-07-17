import { CloudproviderService } from './../cloudprovider/cloudprovider.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProjectDTO,
  paginate,
  IPaginationOptions,
  Pagination
} from '@dinivas/dto';
import { Project } from './project.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
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
    return ProjectsService.toDTO(
      await this.projectRepository.findOne(id, {
        relations: ['cloud_provider']
      })
    );
  }

  async create(projectDTO: ProjectDTO): Promise<ProjectDTO> {
    return ProjectsService.toDTO(await this.projectRepository.save(projectDTO as Project));
  }

  async update(id: number, projectDTO: ProjectDTO) {
    return await this.projectRepository.save(projectDTO);
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
    projectDTO.cloud_provider = CloudproviderService.toDTO(
      project.cloud_provider
    );
    return projectDTO;
  };
}
