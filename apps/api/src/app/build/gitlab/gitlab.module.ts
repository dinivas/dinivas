import { Module } from '@nestjs/common';
import { GitlabController } from './gitlab.controller';
import { GitlabService } from './gitlab.service';

@Module({
  controllers: [GitlabController],
  providers: [GitlabService]
})
export class GitlabModule {}
