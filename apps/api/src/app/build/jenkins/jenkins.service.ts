import { InjectRepository } from '@nestjs/typeorm';
import { Jenkins } from './jenkins.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
  JenkinsDTO,
  ProjectDTO
} from '@dinivas/dto';

@Injectable()
export class JenkinsService {
  static toDTO = (jenkins: Jenkins): JenkinsDTO => {
    const jenkinsDTO = new JenkinsDTO();
    jenkinsDTO.id = jenkins.id;
    jenkinsDTO.code = jenkins.code;
    jenkinsDTO.description = jenkins.description;
    jenkinsDTO.use_floating_ip = jenkins.use_floating_ip;
    jenkinsDTO.architecture_type = jenkins.architecture_type;
    jenkinsDTO.use_existing_master = jenkins.use_existing_master;
    jenkinsDTO.master_cloud_image = jenkins.master_cloud_image;
    jenkinsDTO.master_cloud_flavor = jenkins.master_cloud_flavor;
    jenkinsDTO.master_admin_url = jenkins.master_admin_url;
    jenkinsDTO.master_admin_username = jenkins.master_admin_username;
    jenkinsDTO.master_admin_password = jenkins.master_admin_password;
    jenkinsDTO.existing_master_scheme = jenkins.existing_master_scheme;
    jenkinsDTO.existing_master_host = jenkins.existing_master_host;
    jenkinsDTO.existing_master_port = jenkins.existing_master_port;
    jenkinsDTO.existing_master_username = jenkins.existing_master_username;
    jenkinsDTO.existing_master_password = jenkins.existing_master_password;
    jenkinsDTO.slave_api_scheme = jenkins.slave_api_scheme;
    jenkinsDTO.slave_api_host = jenkins.slave_api_host;
    jenkinsDTO.slave_api_port = jenkins.slave_api_port;
    jenkinsDTO.slave_api_username = jenkins.slave_api_username;
    jenkinsDTO.slave_api_token = jenkins.slave_api_token;
    jenkinsDTO.link_to_keycloak = jenkins.link_to_keycloak;
    jenkinsDTO.keycloak_client_id = jenkins.keycloak_client_id;
    jenkinsDTO.keypair_name = jenkins.keypair_name;
    jenkinsDTO.manage_slave = jenkins.manage_slave;
    jenkinsDTO.network_name = jenkins.network_name;
    jenkinsDTO.network_subnet_name = jenkins.network_subnet_name;
    jenkinsDTO.project = new ProjectDTO();
    jenkinsDTO.project.code = jenkins.project.code;
    jenkinsDTO.project.floating_ip_pool = jenkins.project.floating_ip_pool;
    jenkinsDTO.project.name = jenkins.project.name;
    jenkinsDTO.slave_groups = jenkins.slave_groups;
    return jenkinsDTO;
  };

  constructor(
    @InjectRepository(Jenkins)
    private readonly jenkinsRepository: Repository<Jenkins>
  ) {}

  async findAll(
    paginationOption: IPaginationOptions
  ): Promise<Pagination<JenkinsDTO>> {
    return await paginate<Jenkins>(
      this.jenkinsRepository,
      paginationOption,
      JenkinsService.toDTO,
      { relations: ['project', 'slave_groups'] }
    );
  }

  async findOne(id: number): Promise<Jenkins> {
    const jenkins: Jenkins = await this.jenkinsRepository.findOne(id, {
      relations: ['project','slave_groups']
    });
    if (!jenkins) {
      throw new NotFoundException(`Jenkins with id: ${id} not found`);
    }
    return JenkinsService.toDTO(jenkins);
  }

  async create(jenkinsDTO: JenkinsDTO): Promise<JenkinsDTO> {
    const jenkins: JenkinsDTO = JenkinsService.toDTO(
      await this.jenkinsRepository.save(jenkinsDTO as Jenkins)
    );
    return jenkins;
  }

  async update(id: number, jenkinsDTO: JenkinsDTO): Promise<JenkinsDTO> {
    return JenkinsService.toDTO(
      await this.jenkinsRepository.save(jenkinsDTO as Jenkins)
    );
  }

  async delete(id: number) {
    await this.jenkinsRepository.delete(id);
  }
}
