import { Injectable } from '@nestjs/common';
import {
  ICloudApi,
  ICloudApiInfo,
  ICloudApiConfig,
  ICloudApiInstance,
  ICloudApiImage,
  ICloudApiInstanceAdress,
  ICloudApiDisk
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
    return this.doOnProject(cloudConfig, (project, resolve, reject) => {
      project.nova.listServers((error, servers_array: any[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            servers_array.map(srv => {
              let currentSrvAdresses: ICloudApiInstanceAdress[] = [];
              Object.keys(srv.addresses).forEach(function(key) {
                srv.addresses[key].forEach(addr => {
                  currentSrvAdresses.push({
                    addr: addr.addr,
                    type: addr['OS-EXT-IPS:type'],
                    version: addr.version
                  });
                });
              });
              return {
                id: srv.id,
                name: srv.name,
                keys: srv.key_name,
                status: srv.status,
                adresses: currentSrvAdresses,
                created_date: srv.created,
                updated_date: srv.updated
              } as ICloudApiInstance;
            })
          );
        }
      });
    });
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
                min_disk: img.min_disk ? img.min_disk * 1024 * 1024 * 1024 : 0, //min disk on openstack always in GB, but apimust return bytes
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

  getAllDisks(cloudConfig: ICloudApiConfig): Promise<ICloudApiDisk[]> {
    return this.doOnProject(cloudConfig, (project, resolve, reject) => {
      project.glance.listImages((error, volumes_array: any[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            volumes_array.map(volume => {
              return {
                id: volume.id,
                name: volume.name,
                description: volume.container_format,
                size: volume.size,
                status: volume.status,
                volumeType: volume.visibility,
                date: volume.updated_at,
                metedata: volume.tags
              } as ICloudApiDisk;
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
