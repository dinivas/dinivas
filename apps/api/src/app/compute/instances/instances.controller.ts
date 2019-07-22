import { InstancesService } from './instances.service';
import { AuthzGuard } from '../../auth/authz.guard';
import { Roles } from './../../auth/roles.decorator';
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
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { ICloudApiInstance, ProjectDTO } from '@dinivas/dto';

@ApiUseTags('Compute instances')
@Controller('compute/instances')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class InstancesController {
  constructor(private readonly instancesService: InstancesService) {}

  @Get()
  @Roles('admin')
  async findAll(@Req() request: Request): Promise<ICloudApiInstance[]> {
    const project = request['project'] as ProjectDTO;
    return this.instancesService.getInstances(project.cloud_provider.id);
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
