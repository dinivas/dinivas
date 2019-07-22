import { CloudproviderService } from './cloudprovider.service';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { CloudproviderDTO, Pagination } from '@dinivas/dto';
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
  @Roles('admin')
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
  @Roles('admin')
  async findOne(@Param('id') id: number): Promise<CloudproviderDTO> {
    return this.cloudproviderService.findOne(id);
  }

  @Get(':id/check_connection')
  @Roles('admin')
  async checkConnection(@Param('id') id: number, @Res() response: Response): Promise<any> {
    try {
      const connectionInfo = await this.cloudproviderService.checkConnection(id);
      response.status(200).json(connectionInfo);
    } catch (err) {
      response.status(err.detail.remoteCode).json({error: err.detail.remoteMessage})
    }
  }

  @Post()
  @Roles('admin')
  async create(@Body() cloudProvider: CloudproviderDTO) {
    await this.cloudproviderService.create(cloudProvider);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() cloudProvider: CloudproviderDTO
  ) {
    await this.cloudproviderService.update(id, cloudProvider);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: number) {
    await this.cloudproviderService.delete(id);
  }
}
