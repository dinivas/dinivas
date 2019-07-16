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
      project.glance.listImages((error, images_array: any[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            images_array.map(img => {
              return {
                id: img.id,
                name: img.name,
                container_format: img.container_format,
                owner: img.owner_user_name,
                size: img.size,
                status: img.status,
                min_disk: img.min_disk,
                visibility: img.visibility,
                date: img.updated_at,
                tags: img.tags
              } as ICloudApiImage;
            })
          );
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
