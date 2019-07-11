import { CloudproviderService } from './cloudprovider.service';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { CloudproviderDTO, Pagination } from '@dinivas/dto';
import { Roles } from './../auth/roles.decorator';
import { RolesGuard } from './../auth/roles.guard';
import {
  Controller,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
  Body,
  Post,
  Query
} from '@nestjs/common';

@ApiUseTags('Cloud providers')
@Controller('cloudproviders')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class CloudproviderController {
  constructor(private readonly cloudproviderService: CloudproviderService) {}

  @Get()
  @Roles('admin')
  async findAll(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10
  ): Promise<Pagination<CloudproviderDTO>> {
    return this.cloudproviderService.findAll({
      page,
      limit,
      route: 'http://cats.com/cats'
    });
  }

  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id') id: number): Promise<CloudproviderDTO> {
    return this.cloudproviderService.findOne(id);
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
