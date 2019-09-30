import { Consul } from './consul.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  ConsulDTO,
  paginate,
  ProjectDTO
} from '@dinivas/dto';

@Injectable()
export class ConsulService {
  static toDTO = (consul: Consul): ConsulDTO => {
    const consulDTO = new ConsulDTO();
    consulDTO.code = consul.code;
    consulDTO.project = new ProjectDTO();
    consulDTO.project.code = consul.project.code;
    consulDTO.project.floating_ip_pool = consul.project.floating_ip_pool;
    consulDTO.project.name = consul.project.name;
    consulDTO.project.availability_zone = consul.project.availability_zone;
    return consulDTO;
  };

  constructor(
    @InjectRepository(Consul)
    private readonly consulRepository: Repository<Consul>
  ) {}

  async findAll(
    paginationOption: IPaginationOptions
  ): Promise<Pagination<ConsulDTO>> {
    return await paginate<Consul>(
      this.consulRepository,
      paginationOption,
      ConsulService.toDTO,
      { relations: ['project'] }
    );
  }

  async findOne(id: number): Promise<Consul> {
    const consul: Consul = await this.consulRepository.findOne(id, {
      relations: ['project']
    });
    if (!consul) {
      throw new NotFoundException(`Consul with id: ${id} not found`);
    }
    return ConsulService.toDTO(consul);
  }

  async create(consulDTO: ConsulDTO): Promise<ConsulDTO> {
    const consul: ConsulDTO = ConsulService.toDTO(
      await this.consulRepository.save(consulDTO as Consul)
    );
    return consul;
  }

  async update(id: number, consulDTO: ConsulDTO): Promise<ConsulDTO> {
    return ConsulService.toDTO(
      await this.consulRepository.save(consulDTO as Consul)
    );
  }

  async delete(id: number) {
    await this.consulRepository.delete(id);
  }
}
