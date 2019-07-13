import { CloudApiFactory } from './../core/cloudapi/cloudapi.factory';
import {
  CloudproviderDTO,
  paginate,
  IPaginationOptions,
  Pagination,
  ICloudApi
} from '@dinivas/dto';
import { Cloudprovider } from './cloudprovider.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CloudproviderService {
  constructor(
    @InjectRepository(Cloudprovider)
    private readonly cloudproviderRepository: Repository<Cloudprovider>,
    private cloudApiFactory: CloudApiFactory
  ) {}

  async findAll(
    paginationOption: IPaginationOptions
  ): Promise<Pagination<CloudproviderDTO>> {
    return await paginate<Cloudprovider>(
      this.cloudproviderRepository,
      paginationOption
    );
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

  async checkConnection(id: number) {
    let cloudprovider = await this.cloudproviderRepository.findOne(id);
    const cloudApi = this.cloudApiFactory.getCloudApiService(
      cloudprovider.cloud
    );
    return cloudApi.getProjectInfo(
      this.cloudApiFactory.getCloudApiConfig(
        cloudprovider.cloud,
        cloudprovider.config
      )
    );
  }

  static toDTO(cloudprovider: Cloudprovider): CloudproviderDTO {
    if (cloudprovider != null) {
      delete cloudprovider.config;
    }
    return cloudprovider;
  }
}
