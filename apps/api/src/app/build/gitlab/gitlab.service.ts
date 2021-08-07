import { InjectRepository } from '@nestjs/typeorm';
import { Gitlab } from './gitlab.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
  GitlabDTO,
  ProjectDTO,
} from '@dinivas/api-interfaces';

@Injectable()
export class GitlabService {
  static toDTO = (gitlab: Gitlab): GitlabDTO => {
    const gitlabDTO = new GitlabDTO();
    gitlabDTO.id = gitlab.id;
    gitlabDTO.code = gitlab.code;
    gitlabDTO.description = gitlab.description;
    gitlabDTO.architecture_type = gitlab.architecture_type;
    gitlabDTO.use_existing_instance = gitlab.use_existing_instance;
    gitlabDTO.cloud_image = gitlab.cloud_image;
    gitlabDTO.cloud_flavor = gitlab.cloud_flavor;
    gitlabDTO.existing_instance_url = gitlab.existing_instance_url;
    gitlabDTO.link_to_keycloak = gitlab.link_to_keycloak;
    gitlabDTO.keycloak_client_id = gitlab.keycloak_client_id;
    gitlabDTO.keypair_name = gitlab.keypair_name;
    gitlabDTO.manage_runner = gitlab.manage_runner;
    gitlabDTO.network_name = gitlab.network_name;
    gitlabDTO.network_subnet_name = gitlab.network_subnet_name;
    gitlabDTO.project = new ProjectDTO();
    gitlabDTO.project.code = gitlab.project.code;
    gitlabDTO.project.floating_ip_pool = gitlab.project.floating_ip_pool;
    gitlabDTO.project.name = gitlab.project.name;
    gitlabDTO.runners = gitlab.runners;
    return gitlabDTO;
  };

  constructor(
    @InjectRepository(Gitlab)
    private readonly gitlabRepository: Repository<Gitlab>
  ) {}

  async findAll(
    paginationOption: IPaginationOptions
  ): Promise<Pagination<GitlabDTO>> {
    return await paginate<Gitlab>(
      this.gitlabRepository,
      paginationOption,
      GitlabService.toDTO,
      { relations: ['project', 'runners'] }
    );
  }

  async findOne(id: number): Promise<Gitlab> {
    const gitlab: Gitlab = await this.gitlabRepository.findOne(id, {
      relations: ['project', 'runners'],
    });
    if (!gitlab) {
      throw new NotFoundException(`Gitlab with id: ${id} not found`);
    }
    return GitlabService.toDTO(gitlab);
  }

  async create(gitlabDTO: GitlabDTO): Promise<GitlabDTO> {
    const gitlab: GitlabDTO = GitlabService.toDTO(
      await this.gitlabRepository.save(gitlabDTO as Gitlab)
    );
    return gitlab;
  }

  async update(id: number, gitlabDTO: GitlabDTO): Promise<GitlabDTO> {
    return GitlabService.toDTO(
      await this.gitlabRepository.save(gitlabDTO as Gitlab)
    );
  }

  async delete(id: number) {
    await this.gitlabRepository.delete(id);
  }
}
