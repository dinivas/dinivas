import { Permissions } from './../auth/permissions.decorator';
import { CloudproviderService } from './cloudprovider.service';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {
  CloudproviderDTO,
  Pagination,
  ICloudApiProjectFloatingIpPool,
  ICloudApiProjectRouter,
  ICloudApiFlavor,
  ICloudApiImage,
  ICloudApiAvailabilityZone,
  ICloudApiNetwork,
  ICloudApiProjectFloatingIp,
} from '@dinivas/api-interfaces';
import { AuthzGuard } from '../auth/authz.guard';
import {
  Controller,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
  Body,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

@ApiTags('Cloud providers')
@Controller('cloudproviders')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class CloudproviderController {
  constructor(private readonly cloudproviderService: CloudproviderService) {}

  @Get()
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'The page number',
    required: false,
    example: 0,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'The page size',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'sort',
    type: Number,
    description: 'The sort expression',
    required: false,
    example: 'id,desc',
  })
  @Permissions('cloudproviders:list')
  async findAll(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'id,desc'
  ): Promise<Pagination<CloudproviderDTO>> {
    return this.cloudproviderService.findAll({
      page,
      limit,
      sort,
    });
  }

  @Get(':id')
  @Permissions('cloudproviders:view')
  async findOne(@Param('id') id: number): Promise<CloudproviderDTO> {
    return this.cloudproviderService.findOne(id);
  }

  @Get(':id/raw')
  @Permissions('cloudproviders:view')
  async findOneRaw(@Param('id') id: number): Promise<CloudproviderDTO> {
    return this.cloudproviderService.findOne(id, true);
  }

  @Get(':id/check_connection')
  @Permissions('cloudproviders:view')
  async checkConnection(
    @Param('id') id: number,
    @Res() response: Response
  ): Promise<any> {
    try {
      const connectionInfo = await this.cloudproviderService.checkConnection(
        id
      );
      response.status(200).json(connectionInfo);
    } catch (err) {
      response
        .status(err.detail.remoteCode)
        .json({ error: err.detail.remoteMessage });
    }
  }

  @Get(':id/flavors')
  @Permissions('projects:view')
  async allFlavors(@Param('id') id: number): Promise<ICloudApiFlavor[]> {
    return this.cloudproviderService.getCloudProviderFlavors(id);
  }

  @Get(':id/availability_zones')
  @Permissions('projects:view')
  async allAvailabilityZones(
    @Param('id') id: number
  ): Promise<ICloudApiAvailabilityZone[]> {
    return this.cloudproviderService.getCloudProviderAvailabilityZones(id);
  }

  @Get(':id/images')
  @Permissions('projects:view')
  async allImages(@Param('id') id: number): Promise<ICloudApiImage[]> {
    return this.cloudproviderService.getCloudProviderImages(id);
  }

  @Get(':id/floating_ip_pools')
  @Permissions('projects:view')
  async projectFloatingIpPools(
    @Param('id') id: number
  ): Promise<ICloudApiProjectFloatingIpPool[]> {
    return this.cloudproviderService.getCloudProviderFloatingIpPools(id);
  }
  @Get(':id/floating_ips')
  @Permissions('projects:view')
  async projectFloatingIps(
    @Param('id') id: number
  ): Promise<ICloudApiProjectFloatingIp[]> {
    return this.cloudproviderService.getCloudProviderFloatingIps(id);
  }

  @Get(':id/networks')
  @Permissions('projects:view')
  async projectNetworks(@Param('id') id: number): Promise<ICloudApiNetwork[]> {
    return this.cloudproviderService.getCloudProviderNetworks(id);
  }

  @Get(':id/routers')
  @Permissions('projects:view')
  async projectRouters(
    @Param('id') id: number
  ): Promise<ICloudApiProjectRouter[]> {
    return this.cloudproviderService.getCloudProviderRouters(id);
  }

  @Post()
  @Permissions('cloudproviders:create')
  async create(@Body() cloudProvider: CloudproviderDTO) {
    await this.cloudproviderService.create(cloudProvider);
  }

  @Put(':id')
  @Permissions('cloudproviders:edit')
  async update(
    @Param('id') id: number,
    @Body() cloudProvider: CloudproviderDTO
  ) {
    await this.cloudproviderService.update(id, cloudProvider);
  }

  @Delete(':id')
  @Permissions('cloudproviders:delete')
  async remove(@Param('id') id: number) {
    await this.cloudproviderService.delete(id);
  }
}
