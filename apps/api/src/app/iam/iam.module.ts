import { CoreModule } from './../core/core.module';
import { Module } from '@nestjs/common';
import { IamController } from './iam.controller';
import { IamService } from './iam.service';

@Module({
  imports: [CoreModule],
  controllers: [IamController],
  providers: [IamService]
})
export class IamModule {}
