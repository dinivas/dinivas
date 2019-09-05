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
    jenkinsDTO.master_cloud_image = jenkins.master_cloud_image;
    jenkinsDTO.master_cloud_flavor = jenkins.master_cloud_flavor;
    jenkinsDTO.project = new ProjectDTO();
    jenkinsDTO.project.code = jenkins.project.code;
    jenkinsDTO.project.floating_ip_pool = jenkins.project.floating_ip_pool;
    jenkinsDTO.project.name = jenkins.project.name;
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
      { relations: ['project'] }
    );
  }

  async findOne(id: number): Promise<Jenkins> {
    const project: Jenkins = await this.jenkinsRepository.findOne(id, {
      relations: ['project']
    });
    if (!project) {
      throw new NotFoundException(`Jenkins with id: ${id} not found`);
    }
    return JenkinsService.toDTO(project);
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
