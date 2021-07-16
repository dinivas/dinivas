import { Instance } from './instance.entity';
import { InstanceDTO, ProjectDTO, IPaginationOptions, Pagination, paginate } from '@dinivas/api-interfaces';
import { Cloudprovider } from './../../cloudprovider/cloudprovider.entity';
import { CloudApiFactory } from './../../core/cloudapi/cloudapi.factory';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InstancesService {
  static toDTO = (instance: Instance): InstanceDTO => {
    const instanceDTO = new InstanceDTO();
    instanceDTO.id = instance.id;
    instanceDTO.code = instance.code;
    instanceDTO.description = instance.description;
    instanceDTO.use_floating_ip = instance.use_floating_ip;
    instanceDTO.cloud_image = instance.cloud_image;
    instanceDTO.cloud_flavor = instance.cloud_flavor;
    instanceDTO.keypair_name = instance.keypair_name;
    instanceDTO.network_name = instance.network_name;
    instanceDTO.network_subnet_name = instance.network_subnet_name;
    instanceDTO.availability_zone = instance.availability_zone;
    instanceDTO.project = new ProjectDTO();
    instanceDTO.project.code = instance.project.code;
    instanceDTO.project.name = instance.project.name;
    return instanceDTO;
  };

  constructor(
    @InjectRepository(Cloudprovider)
    private readonly cloudproviderRepository: Repository<Cloudprovider>,
    @InjectRepository(Instance)
    private readonly instanceRepository: Repository<Instance>,
    private cloudApiFactory: CloudApiFactory
  ) {}

  async findAll(
    paginationOption: IPaginationOptions
  ): Promise<Pagination<InstanceDTO>> {
    return await paginate<Instance>(
      this.instanceRepository,
      paginationOption,
      InstancesService.toDTO,
      { relations: ['project'] }
    );
  }

  async findOne(id: number): Promise<Instance> {
    const instance: Instance = await this.instanceRepository.findOne(id, {
      relations: ['project']
    });
    if (!instance) {
      throw new NotFoundException(`Instance with id: ${id} not found`);
    }
    return InstancesService.toDTO(instance);
  }

  async create(instanceDTO: InstanceDTO): Promise<InstanceDTO> {
    const instance: InstanceDTO = InstancesService.toDTO(
      await this.instanceRepository.save(instanceDTO as Instance)
    );
    return instance;
  }

  async update(id: number, instanceDTO: InstanceDTO): Promise<InstanceDTO> {
    return InstancesService.toDTO(
      await this.instanceRepository.save(instanceDTO as Instance)
    );
  }

  async delete(id: number) {
    await this.instanceRepository.delete(id);
  }

  async getInstances(cloudProviderId: number) {
    let cloudprovider = await this.cloudproviderRepository.findOne(
      cloudProviderId
    );
    const cloudApi = this.cloudApiFactory.getCloudApiService(
      cloudprovider.cloud
    );
    return cloudApi.getAllinstances(
      this.cloudApiFactory.getCloudApiConfig(
        cloudprovider.cloud,
        cloudprovider.config
      )
    );
  }
}
