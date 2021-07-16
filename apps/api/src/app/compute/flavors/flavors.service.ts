import { CloudApiFactory } from './../../core/cloudapi/cloudapi.factory';
import { Cloudprovider } from './../../cloudprovider/cloudprovider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class FlavorsService {
  constructor(
    @InjectRepository(Cloudprovider)
    private readonly cloudproviderRepository: Repository<Cloudprovider>,
    private cloudApiFactory: CloudApiFactory
  ) {}

  async getFlavors(cloudProviderId: number) {
    let cloudprovider = await this.cloudproviderRepository.findOne(
      cloudProviderId
    );
    const cloudApi = this.cloudApiFactory.getCloudApiService(
      cloudprovider.cloud
    );
    return cloudApi.getAllFlavors(
      this.cloudApiFactory.getCloudApiConfig(
        cloudprovider.cloud,
        cloudprovider.config
      )
    );
  }
}
