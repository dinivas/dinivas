import { InjectRepository } from '@nestjs/typeorm';
import { RabbitMQ } from './rabbitmq.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
  RabbitMQDTO,
  ProjectDTO
} from '@dinivas/dto';

@Injectable()
export class RabbitMQService {
  static toDTO = (rabbitmq: RabbitMQ): RabbitMQDTO => {
    const rabbitMQDTO = new RabbitMQDTO();
    rabbitMQDTO.id = rabbitmq.id;
    rabbitMQDTO.code = rabbitmq.code;
    rabbitMQDTO.description = rabbitmq.description;
    rabbitMQDTO.use_floating_ip = rabbitmq.use_floating_ip;
    rabbitMQDTO.architecture_type = rabbitmq.architecture_type;
    rabbitMQDTO.keypair_name = rabbitmq.keypair_name;
    rabbitMQDTO.network_name = rabbitmq.network_name;
    rabbitMQDTO.network_subnet_name = rabbitmq.network_subnet_name;
    rabbitMQDTO.project = new ProjectDTO();
    rabbitMQDTO.project.code = rabbitmq.project.code;
    rabbitMQDTO.project.floating_ip_pool = rabbitmq.project.floating_ip_pool;
    rabbitMQDTO.project.name = rabbitmq.project.name;
    return rabbitMQDTO;
  };

  constructor(
    @InjectRepository(RabbitMQ)
    private readonly rabbitmqRepository: Repository<RabbitMQ>
  ) {}

  async findAll(
    paginationOption: IPaginationOptions
  ): Promise<Pagination<RabbitMQDTO>> {
    return await paginate<RabbitMQ>(
      this.rabbitmqRepository,
      paginationOption,
      RabbitMQService.toDTO,
      { relations: ['project'] }
    );
  }

  async findOne(id: number): Promise<RabbitMQ> {
    const rabbitmq: RabbitMQ = await this.rabbitmqRepository.findOne(id, {
      relations: ['project']
    });
    if (!rabbitmq) {
      throw new NotFoundException(`RabbitMQ with id: ${id} not found`);
    }
    return RabbitMQService.toDTO(rabbitmq);
  }

  async create(rabbitMQDTO: RabbitMQDTO): Promise<RabbitMQDTO> {
    const rabbitmq: RabbitMQDTO = RabbitMQService.toDTO(
      await this.rabbitmqRepository.save(rabbitMQDTO as RabbitMQ)
    );
    return rabbitmq;
  }

  async update(id: number, rabbitMQDTO: RabbitMQDTO): Promise<RabbitMQDTO> {
    return RabbitMQService.toDTO(
      await this.rabbitmqRepository.save(rabbitMQDTO as RabbitMQ)
    );
  }

  async delete(id: number) {
    await this.rabbitmqRepository.delete(id);
  }
}
