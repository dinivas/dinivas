import { map } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';
import {
  ICloudApi,
  ICloudApiInfo,
  ICloudApiConfig,
  ICloudApiInstance,
  ICloudApiImage
} from '@dinivas/dto';
const OSWrap = require('openstack-wrapper');

@Injectable()
export class OpenstackApiService implements ICloudApi {
  getProjectInfo(cloudConfig: ICloudApiConfig): Promise<ICloudApiInfo> {
    return this.doOnProject(cloudConfig, (project, resolve, reject) => {
      resolve({
        user_name: project.project_token.user.name,
        project_name: project.project_token.project.name
      });
    });
  }
  getAllinstances(cloudConfig: ICloudApiConfig): Promise<ICloudApiInstance[]> {
    return null;
  }

  getAllImages(cloudConfig: ICloudApiConfig): Promise<ICloudApiImage[]> {
    return this.doOnProject(cloudConfig, (project, resolve, reject) => {
      project.glance.listImages((error, images_array) => {
        if (error) {
          reject(error);
        } else {
          resolve(images_array.map());
        }
      });
    });
  }

  private doOnProject<T>(
    cloudConfig: ICloudApiConfig,
    callback: (
      project: any,
      resolve: (value?: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      OSWrap.getSimpleProject(
        cloudConfig.username,
        cloudConfig.password,
        cloudConfig.project_id,
        cloudConfig.auth_url,
        function(error, project) {
          if (error) {
            reject(error);
          } else {
            callback(project, resolve, reject);
          }
        }
      );
    });
  }
}
