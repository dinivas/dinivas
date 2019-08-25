import { Permissions } from './../../auth/permissions.decorator';
import { FlavorsService } from './flavors.service';
import { AuthzGuard } from './../../auth/authz.guard';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
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
import { ICloudApiFlavor, ProjectDTO } from '@dinivas/dto';

@ApiUseTags('Compute flavors')
@Controller('compute/flavors')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class FlavorsController {
  constructor(private readonly flavorsService: FlavorsService) {}

  @Get()
  @Permissions('compute.flavors:list')
  async findAll(@Req() request: Request): Promise<ICloudApiFlavor[]> {
    const project = request['project'] as ProjectDTO;
    return this.flavorsService.getFlavors(project.cloud_provider.id);
  }
}
