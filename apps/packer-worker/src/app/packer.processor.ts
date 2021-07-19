import {
  BuildModuleImageCommand,
  BULL_PACKER_BUILD_QUEUE,
} from '@dinivas/api-interfaces';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { BuildImageCommandHandler } from './build-image.handler';

@Processor(BULL_PACKER_BUILD_QUEUE)
export class PackerProcessor {
  private readonly logger = new Logger(PackerProcessor.name);

  constructor(private readonly buildImageHandler: BuildImageCommandHandler) {}

  @Process('build')
  async handlePackerBuild(buildImageJob: Job<BuildModuleImageCommand>) {
    this.logger.debug(
      `Receive Build Image Job [${
        buildImageJob.id
      }] with datas: ${JSON.stringify(
        buildImageJob.data as BuildModuleImageCommand
      )}`
    );
    return this.buildImageHandler.execute(buildImageJob, buildImageJob.data);
  }
}
