import { Injectable } from '@nestjs/common';
import {
  ICloudApi,
  ICloudApiInfo,
  ICloudApiConfig,
  ICloudApiInstance
} from '@dinivas/dto';
const OSWrap = require('openstack-wrapper');

@Injectable()
export class OpenstackApiService implements ICloudApi {

  getProjectInfo(cloudConfig: ICloudApiConfig): Promise<ICloudApiInfo> {
    return new Promise<ICloudApiInfo>((resolve, reject) => {
      OSWrap.getSimpleProject(
        cloudConfig.username,
        cloudConfig.password,
        cloudConfig.project_id,
        cloudConfig.auth_url,
        function(error, project) {
          if (error) {
            reject(error);
          } else {
            //console.log('A Simple Project Object was retrieved', project);
            resolve({
              user_name: project.project_token.user.name,
              project_name: project.project_token.project.name
            });
          }
        }
      );
    });
  }
  getAllinstances(cloudConfig: ICloudApiConfig): ICloudApiInstance[] {
    return [];
  }
}
