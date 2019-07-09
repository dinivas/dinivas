import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { CloudproviderDTO } from '@dinivas/dto';
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
    Post
  } from '@nestjs/common';

@ApiUseTags('Cloud providers')
@Controller('cloudproviders')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class CloudproviderController {
  @Get()
  
  findAll(): CloudproviderDTO[] {
    return [];
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string): CloudproviderDTO {
    return null;
  }
  
  @Post()
  @Roles('admin')
  create(@Body() cloudProvider: CloudproviderDTO) {
    return null;
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
