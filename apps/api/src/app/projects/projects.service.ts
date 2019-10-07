import { ConsulService } from './../network/consul/consul.service';
import { Consul } from './../network/consul/consul.entity';
import { CloudApiFactory } from './../core/cloudapi/cloudapi.factory';
import { CloudproviderService } from './../cloudprovider/cloudprovider.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProjectDTO,
  paginate,
  IPaginationOptions,
  Pagination,
  ICloudApiProjectQuota,
  ProjectDefinitionDTO
} from '@dinivas/dto';
import { Project } from './project.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  static toDTO = (project: Project): ProjectDTO => {
    const projectDTO: ProjectDTO = new ProjectDTO();
    projectDTO.id = project.id;
    projectDTO.name = project.name;
    projectDTO.code = project.code;
    projectDTO.root_domain = project.root_domain;
    projectDTO.description = project.description;
    projectDTO.public_router = project.public_router;
    projectDTO.availability_zone = project.availability_zone;
    projectDTO.floating_ip_pool = project.floating_ip_pool;
    projectDTO.monitoring = project.monitoring;
    projectDTO.logging = project.logging;
    projectDTO.logging_stack = project.logging_stack;
    projectDTO.management_subnet_cidr = project.management_subnet_cidr;
    projectDTO.management_subnet_dhcp_allocation_start =
      project.management_subnet_dhcp_allocation_start;
    projectDTO.management_subnet_dhcp_allocation_end =
      project.management_subnet_dhcp_allocation_end;
    projectDTO.enable_proxy = project.enable_proxy;
    projectDTO.keycloak_host = project.keycloak_host;
    projectDTO.keycloak_client_id = project.keycloak_client_id;
    projectDTO.keycloak_client_secret = project.keycloak_client_secret;
    projectDTO.proxy_cloud_flavor = project.proxy_cloud_flavor;
    projectDTO.bastion_cloud_image = project.bastion_cloud_image;
    projectDTO.bastion_cloud_flavor = project.bastion_cloud_flavor;
    projectDTO.prometheus_cloud_flavor = project.prometheus_cloud_flavor;
    projectDTO.cloud_provider = CloudproviderService.toDTO(
      project.cloud_provider
    );
    return projectDTO;
  };

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly consulService: ConsulService,
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

  async create(
    projectDefinition: ProjectDefinitionDTO
  ): Promise<ProjectDefinitionDTO> {
    const project: ProjectDTO = ProjectsService.toDTO(
      await this.projectRepository.save(projectDefinition.project as Project)
    );
    projectDefinition.consul.project = project;
    const consul = await this.consulService.create(projectDefinition.consul);
    return { project, consul };
  }

  async update(
    id: number,
    projectDefinition: ProjectDefinitionDTO
  ): Promise<ProjectDefinitionDTO> {
    const project: ProjectDTO = ProjectsService.toDTO(
      await this.projectRepository.save(projectDefinition.project as Project)
    );
    const consul = await this.consulService.update(
      projectDefinition.consul.id,
      projectDefinition.consul
    );
    return { project, consul };
  }

  async delete(id: number) {
    await this.projectRepository.delete(id);
  }
}
