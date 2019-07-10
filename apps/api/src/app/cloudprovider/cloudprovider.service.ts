import { CloudproviderDTO } from '@dinivas/dto';
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

  findAll(): Promise<Cloudprovider[]> {
    return this.cloudproviderRepository.find();
  }

  findOne(id: number): Promise<Cloudprovider> {
    return this.cloudproviderRepository.findOne(id);
  }

  create(cloudproviderDTO: CloudproviderDTO) {
    return this.cloudproviderRepository.save(cloudproviderDTO);
  }
}
