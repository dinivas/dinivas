import { ProjectDTO, JenkinsDTO } from '@dinivas/api-interfaces';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

type TerraformModuleType = ProjectDTO | JenkinsDTO;
type TerraformJobOptions = {
  projectCode: string;
  cloudprovider: string;
  moduleName: string;
  cloudConfig: any;
};

@Injectable()
export class TerraformService {
  constructor(
    
  ) {}

  async plan<T extends TerraformModuleType>(
    option: TerraformJobOptions,
    data: T
  ) {
    // const planJob = await this.terraformModuleQueue.add('plan', {
    //   option,
    //   data,
    // });
    // return planJob.id;
  }

  async apply<T extends TerraformModuleType>(
    option: TerraformJobOptions,
    data: T
  ) {
    // const applyJob = await this.terraformModuleQueue.add('apply', {
    //   option,
    //   data,
    // });
    // return applyJob.id;
  }
  async destroy<T extends TerraformModuleType>(
    option: TerraformJobOptions,
    data: T
  ) {
    // const destroyJob = await this.terraformModuleQueue.add('destroy', {
    //   option,
    //   data,
    // });
    // return destroyJob.id;
  }
}
