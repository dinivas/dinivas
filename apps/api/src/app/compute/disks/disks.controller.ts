import { Permissions } from './../../auth/permissions.decorator';
import { DisksService } from './disks.service';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthzGuard } from '../../auth/authz.guard';
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
import { ProjectDTO, ICloudApiDisk } from '@dinivas/dto';

@ApiUseTags('Compute disks')
@Controller('compute/disks')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class DisksController {
  constructor(private readonly disksServices: DisksService) {}

  @Get()
  @Permissions('compute.disks:list')
  async findAll(@Req() request: Request): Promise<ICloudApiDisk[]> {
    const project = request['project'] as ProjectDTO;
    return this.disksServices.getDisks(project.cloud_provider.id);
  }

  @Get(':id')
  @Permissions('compute.disks:view')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }
  @Put(':id')
  @Permissions('compute.disks:edit')
  update(@Param('id') id: string, @Body() updateCatDto: any) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  @Permissions('compute.disks:delete')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
