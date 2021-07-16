import { CoreModule } from '../core/core.module';
import { Module } from '@nestjs/common';
import { AdminIamController } from './admin-iam.controller';
import { AdminIamService } from './admin-iam.service';

@Module({
  imports: [CoreModule],
  controllers: [AdminIamController],
  providers: [AdminIamService]
})
export class AdminIamModule {}
