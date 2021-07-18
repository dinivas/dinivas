import { Injectable } from '@nestjs/common';
import {
  ICloudApi,
  ICloudApiInfo,
  ICloudApiConfig,
  ICloudApiInstance,
  ICloudApiImage,
  ICloudApiInstanceAdress,
  ICloudApiDisk,
  ICloudApiProjectQuota,
  ICloudApiProjectFloatingIpPool,
  ICloudApiProjectRouter,
  ICloudApiFlavor,
  ICloudApiAvailabilityZone,
  ICloudApiNetwork,
  ICloudApiProjectFloatingIp,
} from '@dinivas/api-interfaces';
import OSWrap = require('openstack-wrapper');

const CLOUD_PROVIDER_NAME = 'openstack';

@Injectable()
export class OpenstackApiService implements ICloudApi {
  getAllAvailabilityZones(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiAvailabilityZone[]> {
    return this.doOnProject(cloudConfig, (project, resolve, reject) => {
      project.nova.listAvailabilityZones((error, availabilityZones) => {
        if (error) {
          reject(error);
        } else {
          resolve(availabilityZones as ICloudApiAvailabilityZone[]);
        }
      });
    });
  }
  getProjectInfo(cloudConfig: ICloudApiConfig): Promise<ICloudApiInfo> {
    return this.doOnProject(cloudConfig, (project, resolve, reject) => {
      resolve({
        user_name: project.project_token.user.name,
        project_name: project.project_token.project.name,
      });
    });
  }

  getProjectQuota(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiProjectQuota> {
    return this.doOnProject(cloudConfig, (project, resolve, reject) => {
      project.nova.getQuotaSet(
        `${cloudConfig.project_id}/detail`,
        (error, quota_set) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              id: quota_set.id,
              instances: quota_set.instances,
              cores: quota_set.cores,
              ram: quota_set.ram,
              floating_ips: quota_set.floating_ips,
            });
          }
        }
      );
    });
  }

  getProjectFloatingIpPools(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiProjectFloatingIpPool[]> {
    return this.doOnProject(cloudConfig, (project, resolve, reject) => {
      project.nova.listFloatingIpPools((error, floating_ip_pools) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            floating_ip_pools.map((floatingIpPool) => {
              return {
                name: floatingIpPool.name,
                cloudprovider: CLOUD_PROVIDER_NAME,
              };
            })
          );
        }
      });
    });
  }

  getProjectFloatingIps(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiProjectFloatingIp[]> {
    return this.doOnProject(cloudConfig, (project, resolve, reject) => {
      project.nova.listFloatingIps((error, floating_ips) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            floating_ips.map((floatingIp) => {
              return {
                id: floatingIp.id,
                fixed_ip: floatingIp.fixed_ip,
                instance_id: floatingIp.instance_id,
                ip: floatingIp.ip,
                pool: floatingIp.pool,
                cloudprovider: CLOUD_PROVIDER_NAME,
              };
            })
          );
        }
      });
    });
  }

  getProjectNetworks(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiNetwork[]> {
    return this.doOnProject(cloudConfig, (project, resolve, reject) => {
      project.nova.listProjectNetworks((error, network_array) => {
        if (error) {
          reject(error);
        } else {
          resolve(network_array as ICloudApiNetwork[]);
        }
      });
    });
  }

  getProjectRouters(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiProjectRouter[]> {
    return this.doOnProject(cloudConfig, (project, resolve, reject) => {
      project.neutron.listRouters((error, routers_array) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            routers_array.map((router) => {
              return {
                id: router.id,
                name: router.name,
                description: router.description,
                status: router.status,
                tags: router.tags,
                cloudprovider: CLOUD_PROVIDER_NAME,
              };
            })
          );
        }
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
            servers_array.map((srv) => {
              const currentSrvAdresses: ICloudApiInstanceAdress[] = [];
              Object.keys(srv.addresses).forEach(function (key) {
                srv.addresses[key].forEach((addr) => {
                  currentSrvAdresses.push({
                    addr: addr.addr,
                    type: addr['OS-EXT-IPS:type'],
                    version: addr.version,
                    cloudprovider: CLOUD_PROVIDER_NAME,
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
                updated_date: srv.updated,
                metadata: srv.metadata,
              } as ICloudApiInstance;
            })
          );
        }
      });
    });
  }

  getAllFlavors(cloudConfig: ICloudApiConfig): Promise<ICloudApiFlavor[]> {
    return this.doOnProject(cloudConfig, (project, resolve, reject) => {
      project.nova.listFlavors((error, flavors_array: any[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            flavors_array.map((flavor) => {
              return {
                id: flavor.id,
                name: flavor.name,
                description: flavor.description,
                vcpus: flavor.vcpus,
                ram: flavor.ram,
                disk: flavor.disk,
                swap: flavor.swap,
                is_public: flavor['os-flavor-access:is_public'],
                cloudprovider: CLOUD_PROVIDER_NAME,
              } as ICloudApiFlavor;
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
            images_array.map((img) => {
              return {
                id: img.id,
                name: img.name,
                container_format: img.container_format,
                owner: img.owner_user_name,
                size: img.size,
                status: img.status,
                min_disk: img.min_disk ? img.min_disk * 1024 * 1024 * 1024 : 0, //min disk on openstack always in GB, but apimust return bytes
                min_ram: img.min_ram,
                visibility: img.visibility,
                date: img.updated_at,
                tags: img.tags,
                cloudprovider: CLOUD_PROVIDER_NAME,
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
            volumes_array.map((volume) => {
              return {
                id: volume.id,
                name: volume.name,
                description: volume.container_format,
                size: volume.size,
                status: volume.status,
                volumeType: volume.visibility,
                date: volume.updated_at,
                metedata: volume.tags,
                cloudprovider: CLOUD_PROVIDER_NAME,
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
        function (error, project) {
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
