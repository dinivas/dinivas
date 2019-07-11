import { CloudproviderDTO, paginate, IPaginationOptions, Pagination } from '@dinivas/dto';
import { Cloudprovider } from './cloudprovider.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CloudproviderService {
  constructor(
    @InjectRepository(Cloudprovider)
    private readonly cloudproviderRepository: Repository<Cloudprovider>
  ) {}

  async findAll(paginationOption: IPaginationOptions): Promise<Pagination<Cloudprovider>> {
    return await paginate<Cloudprovider>(this.cloudproviderRepository, paginationOption);
  }

  findOne(id: number): Promise<Cloudprovider> {
    return this.cloudproviderRepository.findOne(id);
  }

  async create(cloudproviderDTO: CloudproviderDTO) {
    return await this.cloudproviderRepository.save(cloudproviderDTO);
  }

  async update(id: number, cloudproviderDTO: CloudproviderDTO) {
    return await this.cloudproviderRepository.save(cloudproviderDTO);
  }

  async delete(id: number) {
    await this.cloudproviderRepository.delete(id);
  }
}
