import { ConsulModule } from './../../network/consul/consul.module';
import { TerraformModule } from './../../terraform/terraform.module';
import { CloudproviderModule } from './../../cloudprovider/cloudprovider.module';
import { TerraformStateModule } from './../../terraform/terraform-state/terraform-state.module';
import { CoreModule } from './../../core/core.module';
import { Jenkins } from './jenkins.entity';
import { Module } from '@nestjs/common';
import { JenkinsController } from './jenkins.controller';
import { JenkinsService } from './jenkins.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Jenkins]),
    CoreModule,
    TerraformModule,
    TerraformStateModule,
    CloudproviderModule,
    ConsulModule,
  ],
  controllers: [JenkinsController],
  providers: [JenkinsService],
  exports: [JenkinsService],
})
export class JenkinsModule {}
