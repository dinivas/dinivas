import { Permissions } from './../../auth/permissions.decorator';
import { ImagesService } from './images.service';
import { AuthzGuard } from '../../auth/authz.guard';
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
@UseGuards(AuthzGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  @Permissions('compute.images:list')
  async findAll(@Req() request: Request): Promise<ICloudApiImage[]> {
    const project = request['project'] as ProjectDTO;
    return this.imagesService.getImages(project.cloud_provider.id);
  }

  @Get(':id')
  @Permissions('compute.images:get')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }
  @Put(':id')
  @Permissions('compute.images:edit')
  update(@Param('id') id: string, @Body() updateCatDto: any) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  @Permissions('compute.images:delete')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
