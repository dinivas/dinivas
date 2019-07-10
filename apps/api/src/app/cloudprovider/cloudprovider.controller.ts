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
  async findAll(@Query('page') page: number = 0, @Query('limit') limit: number = 10): Promise<Pagination<CloudproviderDTO>> {
    return this.cloudproviderService.findAll({page, limit, route: 'http://cats.com/cats',});
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
  update(@Param('id') id: string, @Body() cloudProvider: CloudproviderDTO) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
