import { InjectRepository } from '@nestjs/typeorm';
import { Cloudprovider } from './../../cloudprovider/cloudprovider.entity';
import { CloudApiFactory } from './../../core/cloudapi/cloudapi.factory';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Cloudprovider)
    private readonly cloudproviderRepository: Repository<Cloudprovider>,
    private cloudApiFactory: CloudApiFactory
  ) {}

  async getImages(cloudProviderId: number) {
    let cloudprovider = await this.cloudproviderRepository.findOne(
      cloudProviderId
    );
    const cloudApi = this.cloudApiFactory.getCloudApiService(
      cloudprovider.cloud
    );
    return cloudApi.getAllImages(
      this.cloudApiFactory.getCloudApiConfig(
        cloudprovider.cloud,
        cloudprovider.config
      )
    );
  }
}
