import { Permissions } from './../auth/permissions.decorator';
import { CloudproviderService } from './cloudprovider.service';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { CloudproviderDTO, Pagination, ICloudApiProjectFloatingIpPool, ICloudApiProjectRouter } from '@dinivas/dto';
import { Roles } from './../auth/roles.decorator';
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
  Res
} from '@nestjs/common';
import { Response } from 'express';

@ApiUseTags('Cloud providers')
@Controller('cloudproviders')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class CloudproviderController {
  constructor(private readonly cloudproviderService: CloudproviderService) {}

  @Get()
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
      route: 'http://cats.com/cats'
    });
  }

  @Get(':id')
  @Permissions('cloudproviders:view')
  async findOne(@Param('id') id: number): Promise<CloudproviderDTO> {
    return this.cloudproviderService.findOne(id);
  }

  @Get(':id/check_connection')
  @Permissions('cloudproviders:view')
  async checkConnection(@Param('id') id: number, @Res() response: Response): Promise<any> {
    try {
      const connectionInfo = await this.cloudproviderService.checkConnection(id);
      response.status(200).json(connectionInfo);
    } catch (err) {
      response.status(err.detail.remoteCode).json({error: err.detail.remoteMessage})
    }
  }

  @Get(':id/floating_ip_pools')
  @Permissions('projects:view')
  async projectFloatingIpPools(
    @Param('id') id: number
  ): Promise<ICloudApiProjectFloatingIpPool[]> {
    return this.cloudproviderService.getCloudProviderFloatingIpPools(id);
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
