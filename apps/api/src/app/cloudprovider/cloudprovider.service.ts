import { CloudApiFactory } from './../core/cloudapi/cloudapi.factory';
import to from 'await-to-js';
import {
  CloudproviderDTO,
  paginate,
  IPaginationOptions,
  Pagination,
  ICloudApiProjectRouter,
  ICloudApiProjectFloatingIpPool,
  ICloudApiAvailabilityZone,
  ICloudApiNetwork,
  ICloudApiProjectFloatingIp
} from '@dinivas/api-interfaces';
import { Cloudprovider } from './cloudprovider.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
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
      paginationOption,
      CloudproviderService.toDTO
    );
  }

  async findOne(id: number, raw = false): Promise<CloudproviderDTO> {
    if (!raw) {
      return CloudproviderService.toDTO(
        await this.cloudproviderRepository.findOne(id)
      );
    } else {
      return this.cloudproviderRepository.findOne(id);
    }
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
    const cloudprovider = await this.cloudproviderRepository.findOne(id);
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

  async getCloudProviderAvailabilityZones(
    id: number
  ): Promise<ICloudApiAvailabilityZone[]> {
    const cloudprovider: Cloudprovider = await this.cloudproviderRepository.findOne(
      id
    );
    const cloudApi = this.cloudApiFactory.getCloudApiService(
      cloudprovider.cloud
    );
    return cloudApi.getAllAvailabilityZones(
      this.cloudApiFactory.getCloudApiConfig(
        cloudprovider.cloud,
        cloudprovider.config
      )
    );
  }

  async getCloudProviderFloatingIpPools(
    id: number
  ): Promise<ICloudApiProjectFloatingIpPool[]> {
    const cloudprovider: Cloudprovider = await this.cloudproviderRepository.findOne(
      id
    );
    const cloudApi = this.cloudApiFactory.getCloudApiService(
      cloudprovider.cloud
    );
    return cloudApi.getProjectFloatingIpPools(
      this.cloudApiFactory.getCloudApiConfig(
        cloudprovider.cloud,
        cloudprovider.config
      )
    );
  }

  async getCloudProviderFloatingIps(
    id: number
  ): Promise<ICloudApiProjectFloatingIp[]> {
    const cloudprovider: Cloudprovider = await this.cloudproviderRepository.findOne(
      id
    );
    const cloudApi = this.cloudApiFactory.getCloudApiService(
      cloudprovider.cloud
    );
    return cloudApi.getProjectFloatingIps(
      this.cloudApiFactory.getCloudApiConfig(
        cloudprovider.cloud,
        cloudprovider.config
      )
    );
  }

  async getCloudProviderNetworks(id: number): Promise<ICloudApiNetwork[]> {
    const [err, cloudprovider] = await to(
      this.cloudproviderRepository.findOne(id)
    );
    if (err) {
      throw new BadRequestException(err);
    }
    const cloudApi = this.cloudApiFactory.getCloudApiService(
      cloudprovider.cloud
    );
    return cloudApi.getProjectNetworks(
      this.cloudApiFactory.getCloudApiConfig(
        cloudprovider.cloud,
        cloudprovider.config
      )
    );
  }

  async getCloudProviderRouters(id: number): Promise<ICloudApiProjectRouter[]> {
    const [err, cloudprovider] = await to(
      this.cloudproviderRepository.findOne(id)
    );
    if (err) {
      throw new BadRequestException(err);
    }
    const cloudApi = this.cloudApiFactory.getCloudApiService(
      cloudprovider.cloud
    );
    return cloudApi.getProjectRouters(
      this.cloudApiFactory.getCloudApiConfig(
        cloudprovider.cloud,
        cloudprovider.config
      )
    );
  }

  async getCloudProviderFlavors(cloudProviderId: number) {
    const cloudprovider = await this.cloudproviderRepository.findOne(
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

  async getCloudProviderImages(cloudProviderId: number) {
    const cloudprovider = await this.cloudproviderRepository.findOne(
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

  static toDTO(cloudprovider: Cloudprovider): CloudproviderDTO {
    if (cloudprovider != null) {
      delete cloudprovider.config;
    }
    return cloudprovider;
  }
}
