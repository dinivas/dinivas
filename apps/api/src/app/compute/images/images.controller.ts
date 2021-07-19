import { CloudproviderService } from './../../cloudprovider/cloudprovider.service';
import { Permissions } from './../../auth/permissions.decorator';
import { ImagesService } from './images.service';
import { AuthzGuard } from '../../auth/authz.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import {
  Controller,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
  Body,
  Req,
  Post,
  Query,
  Logger,
} from '@nestjs/common';
import {
  ICloudApiImage,
  ProjectDTO,
  ModuleImageToBuildDTO,
  BuildModuleImageCommand,
  BULL_PACKER_BUILD_QUEUE,
} from '@dinivas/api-interfaces';

import YAML = require('js-yaml');
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@ApiTags('Compute images')
@Controller('compute/images')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class ImagesController {
  private readonly logger = new Logger(ImagesController.name);

  constructor(
    private readonly imagesService: ImagesService,
    private readonly cloudproviderService: CloudproviderService,
    @InjectQueue(BULL_PACKER_BUILD_QUEUE)
    private readonly packerBuildQueue: Queue
  ) {}

  @Get('by_cloudprovider/:cloudProviderId')
  @Permissions('compute.images:list')
  async findAll(
    @Param('cloudProviderId') cloudProviderId: string,
    @Query('loadAll') loadAll = false
  ): Promise<ICloudApiImage[]> {
    return this.imagesService.getImages(parseInt(cloudProviderId), {
      loadAll: loadAll,
    });
  }

  @Get(':id')
  @Permissions('compute.images:view')
  findOne(@Param('id') id: string) {
    return `This action returns an instance with id ${id}`;
  }
  @Put(':id')
  @Permissions('compute.images:edit')
  update(@Param('id') id: string, @Body() updateCatDto: any) {
    return `This action updates an instance with id ${id}`;
  }

  @Delete(':id')
  @Permissions('compute.images:delete')
  remove(@Param('id') id: string) {
    return `This action removes an instance with id ${id}`;
  }

  @Post('build')
  @Permissions('compute.images:edit')
  async buildImage(
    @Body() moduleImageToBuild: ModuleImageToBuildDTO
  ): Promise<{ buildImageJobId: number | string }> {
    const cloudprovider = await this.cloudproviderService.findOne(
      moduleImageToBuild.cloudproviderId,
      true
    );
    const buildImageJob = await this.packerBuildQueue.add(
      'build',
      new BuildModuleImageCommand(
        cloudprovider.cloud,
        moduleImageToBuild,
        YAML.load(cloudprovider.config)
      )
    );
    this.logger.debug(
      `Build Image Job Id with datas: ${JSON.stringify(buildImageJob)}`
    );
    return { buildImageJobId: buildImageJob.id };
  }
}
