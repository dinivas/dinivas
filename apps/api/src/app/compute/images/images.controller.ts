import { Roles } from './../../auth/roles.decorator';
import { RolesGuard } from './../../auth/roles.guard';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import {
  Controller,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
  Body,
  Req
} from '@nestjs/common';

@ApiUseTags('Compute images')
@Controller('compute/images')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class ImagesController {
  @Get()
  @Roles('admin')
  findAll(@Req() request: Request): any {
    return { images: 'dd' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: any) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
