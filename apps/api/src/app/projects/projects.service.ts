import { ConsulService } from './../network/consul/consul.service';
import { CloudApiFactory } from './../core/cloudapi/cloudapi.factory';
import { CloudproviderService } from './../cloudprovider/cloudprovider.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProjectDTO,
  paginate,
  IPaginationOptions,
  Pagination,
  ICloudApiProjectQuota,
  ProjectDefinitionDTO,
} from '@dinivas/api-interfaces';
import { Project } from './project.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import crypto = require('crypto');

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
    projectDTO.graylog_compute_image_name = project.graylog_compute_image_name;
    projectDTO.graylog_compute_flavour_name =
      project.graylog_compute_flavour_name;
    projectDTO.management_subnet_cidr = project.management_subnet_cidr;
    projectDTO.management_subnet_dhcp_allocation_start =
      project.management_subnet_dhcp_allocation_start;
    projectDTO.management_subnet_dhcp_allocation_end =
      project.management_subnet_dhcp_allocation_end;
    projectDTO.enable_proxy = project.enable_proxy;
    projectDTO.keycloak_host = project.keycloak_host;
    projectDTO.keycloak_client_id = project.keycloak_client_id;
    projectDTO.keycloak_client_secret = project.keycloak_client_secret;
    projectDTO.proxy_cloud_image = project.proxy_cloud_image;
    projectDTO.proxy_cloud_flavor = project.proxy_cloud_flavor;
    projectDTO.proxy_prefered_floating_ip = project.proxy_prefered_floating_ip;
    projectDTO.bastion_cloud_image = project.bastion_cloud_image;
    projectDTO.bastion_cloud_flavor = project.bastion_cloud_flavor;
    projectDTO.prometheus_cloud_flavor = project.prometheus_cloud_flavor;
    projectDTO.cloud_provider = CloudproviderService.toDTO(
      project.cloud_provider
    );
    projectDTO.status = project.status;
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
      relations: ['cloud_provider'],
    });
    if (!project) {
      throw new NotFoundException(`Project with id: ${id} not found`);
    }
    return ProjectsService.toDTO(project);
  }

  async getProjectQuota(id: number): Promise<ICloudApiProjectQuota> {
    const project: Project = await this.projectRepository.findOne(id, {
      relations: ['cloud_provider'],
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
    projectDefinition.consul.managed_by_project = true;
    const consul = await this.consulService.create(projectDefinition.consul);
    return { project, consul };
  }

  async update(
    projectDefinition: ProjectDefinitionDTO
  ): Promise<ProjectDefinitionDTO> {
    const project: ProjectDTO = ProjectsService.toDTO(
      await this.projectRepository.save(projectDefinition.project as Project)
    );
    projectDefinition.consul.managed_by_project = true;
    const consul = await this.consulService.update(
      projectDefinition.consul.id,
      projectDefinition.consul
    );
    return { project, consul };
  }

  async delete(id: number) {
    await this.projectRepository.delete(id);
  }

  generateProjectGuacamoleToken(projectState: any, cloudProvider: string) {
    const clientOptions = {
      cypher: 'AES-256-CBC',
      key: 'MySuperSecretKeyForParamsToken12',
    };
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      clientOptions.cypher,
      clientOptions.key,
      iv
    );
    const parameters = {
      connection: {
        type: 'ssh',
        settings: {
          hostname: projectState.outputs.bastion_floating_ip.value,
          username: 'digitalocean' === cloudProvider ? 'root' : 'centos',
          'private-key': projectState.outputs.bastion_private_key.value,
        },
      },
    };
    let crypted = cipher.update(JSON.stringify(parameters), 'utf8', 'base64');
    crypted += cipher.final('base64');

    const data = {
      iv: iv.toString('base64'),
      value: crypted,
    };

    return new Buffer(JSON.stringify(data)).toString('base64');
  }
}
