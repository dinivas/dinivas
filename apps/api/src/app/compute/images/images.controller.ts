import { ImagesService } from './images.service';
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
import { ICloudApiImage, ProjectDTO } from '@dinivas/dto';

@ApiUseTags('Compute images')
@Controller('compute/images')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  @Roles('admin')
  async findAll(@Req() request: Request): Promise<ICloudApiImage[]> {
    const project = request['project'] as ProjectDTO;
    return this.imagesService.getImages(project.cloud_provider.id);
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
