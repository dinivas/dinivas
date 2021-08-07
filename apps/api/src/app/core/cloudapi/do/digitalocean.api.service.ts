/* eslint-disable no-async-promise-executor */
import { Injectable, Logger } from '@nestjs/common';
import {
  ICloudApi,
  ICloudApiInfo,
  ICloudApiConfig,
  ICloudApiInstance,
  ICloudApiImage,
  ICloudApiDisk,
  ICloudApiProjectQuota,
  ICloudApiProjectFloatingIpPool,
  ICloudApiProjectRouter,
  ICloudApiFlavor,
  ICloudApiAvailabilityZone,
  ICloudApiNetwork,
  ICloudApiProjectFloatingIp,
  AvailableCloudProvider,
} from '@dinivas/api-interfaces';
import DigitalOcean from 'do-wrapper';
import VPCs from './vpcs';
import RequestHelper from 'do-wrapper/dist/request-helper';
import { ConfigurationService } from '../../../core/config/configuration.service';

const CLOUD_PROVIDER_NAME = 'digitalocean';
@Injectable()
export class DigitalOceanApiService implements ICloudApi {
  private readonly logger = new Logger(DigitalOceanApiService.name);

  constructor(private configService: ConfigurationService) {}

  getAllAvailabilityZones(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiAvailabilityZone[]> {
    return new Promise<ICloudApiAvailabilityZone[]>((resolve, reject) => {
      this.getDOInstance(cloudConfig)
        .regions.getAll('')
        .then((data) => {
          this.logger.debug(`DO regions datas: ${JSON.stringify(data)}`);
          resolve(
            data.regions.map(
              (region: {
                slug: unknown;
                name: unknown;
                available: unknown;
                sizes: [];
                features: [];
              }) => {
                return {
                  hosts: region.name,
                  zoneName: region.slug,
                  zoneState: {
                    available: region.available,
                  },
                  cloudprovider: CLOUD_PROVIDER_NAME,
                };
              }
            )
          );
        })
        .catch((err) => {
          this.logger.error(err);
          reject(err);
        });
    });
  }
  getProjectInfo(cloudConfig: ICloudApiConfig): Promise<ICloudApiInfo> {
    return new Promise<ICloudApiInfo>((resolve, reject) => {
      this.getDOInstance(cloudConfig)
        .projects.getById(cloudConfig.project_id)
        .then((data) => {
          this.logger.debug('Project info datas:', data);
          resolve({
            project_name: '',
            user_name: '',
          });
        })
        .catch((err) => {
          this.logger.error(err);
          reject(err);
        });
    });
  }

  getProjectQuota(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiProjectQuota> {
    return new Promise<ICloudApiProjectQuota>(async (resolve, reject) => {
      const account = (await this.getDOInstance(cloudConfig).account.get())
        .account;
      const floatingIps = (
        await this.getDOInstance(cloudConfig).floatingIPs.getAll('')
      ).floating_ips;
      const droplets = (
        await this.getDOInstance(cloudConfig).droplets.getAll('')
      ).droplets;

      const result: ICloudApiProjectQuota = {
        id: '',
        instances: {
          in_use: droplets.length,
          limit: account.droplet_limit,
          reserved: 0,
          cloudprovider: 'digitalocean',
        },
        cores: {
          in_use: droplets
            .map((d) => d.vcpus)
            .reduce((accumulator, currentValue) => accumulator + currentValue),
          limit: 0,
          reserved: 0,
          cloudprovider: 'digitalocean',
        },
        ram: {
          in_use: droplets
          .map((d) => d.memory)
          .reduce((accumulator, currentValue) => accumulator + currentValue),
          limit: 0,
          reserved: 0,
          cloudprovider: 'digitalocean',
        },
        floating_ips: {
          in_use: floatingIps.length,
          limit: account.floating_ip_limit,
          reserved: 0,
          cloudprovider: 'digitalocean',
        },
      };
      resolve(result);
    });
  }

  getProjectFloatingIpPools(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiProjectFloatingIpPool[]> {
    return new Promise<ICloudApiProjectFloatingIpPool[]>((resolve, reject) => {
      this.getDOInstance(cloudConfig)
        .floatingIPs.getAll('')
        .then((data) => {
          this.logger.debug('Floating Ips datas', data);
          resolve(
            data.floating_ips.map((floatingIp) => {
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
        })
        .catch((err) => {
          this.logger.error(err);
          reject(err);
        });
    });
  }

  getProjectFloatingIps(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiProjectFloatingIp[]> {
    return new Promise<ICloudApiProjectFloatingIp[]>((resolve, reject) => {
      this.getDOInstance(cloudConfig)
        .floatingIPs.getAll('')
        .then((data) => {
          this.logger.debug('Floating Ips datas', data);
          resolve(
            data.floating_ips.map((floatingIp) => {
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
        })
        .catch((err) => {
          this.logger.error(err);
          reject(err);
        });
    });
  }

  getProjectNetworks(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiNetwork[]> {
    return new Promise<ICloudApiNetwork[]>((resolve, reject) => {
      const requestHelper = new RequestHelper(cloudConfig.password);
      const vpcs = new VPCs(10, requestHelper);
      vpcs
        .getAll('')
        .then((data) => {
          this.logger.debug(`Project VPCs datas: ${JSON.stringify(data)}`);
          resolve(
            data.vpcs.map(
              (vpc: {
                id: string;
                ip_range: string;
                name: string;
                region: string;
              }) => {
                return {
                  id: vpc.id,
                  cidr: vpc.ip_range,
                  label: vpc.name,
                  cloudprovider: CLOUD_PROVIDER_NAME,
                  region: vpc.region,
                } as ICloudApiNetwork;
              }
            )
          );
        })
        .catch((err) => {
          this.logger.error(err);
          reject(err);
        });
    });
  }

  getProjectRouters(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiProjectRouter[]> {
    return new Promise<ICloudApiProjectRouter[]>((resolve, reject) => {
      this.getDOInstance(cloudConfig)
        .floatingIPs.getAll('')
        .then((data) => {
          this.logger.debug('Project Router datas', data);
          resolve(
            data.floating_ips.map((floatingIp) => {
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
        })
        .catch((err) => {
          this.logger.error(err);
          reject(err);
        });
    });
  }

  getAllinstances(cloudConfig: ICloudApiConfig): Promise<ICloudApiInstance[]> {
    return new Promise<ICloudApiInstance[]>((resolve, reject) => {
      this.getDOInstance(cloudConfig)
        .droplets.getAll('')
        .then((data) => {
          this.logger.debug('Project Droplet datas', data);
          resolve(
            data.droplets.map(
              (droplet: {
                id: any;
                name: any;
                status: any;
                created_at: any;
                networks: { v4: any[] };
                tags: any[];
              }) => {
                return {
                  id: droplet.id,
                  name: droplet.name,
                  status: droplet.status,
                  created_date: droplet.created_at,
                  adresses: droplet.networks.v4.map((t) => {
                    return {
                      addr: t.ip_address,
                      cloudprovider: CLOUD_PROVIDER_NAME,
                      type: t.type,
                      version: 'IPV4',
                    };
                  }),
                  metadata: {
                    tags: droplet.tags.join(','),
                  },
                  cloudprovider: CLOUD_PROVIDER_NAME,
                } as ICloudApiInstance;
              }
            )
          );
        })
        .catch((err) => {
          this.logger.error(err);
          reject(err);
        });
    });
  }

  getAllFlavors(cloudConfig: ICloudApiConfig): Promise<ICloudApiFlavor[]> {
    return new Promise<ICloudApiFlavor[]>((resolve, reject) => {
      this.getDOInstance(cloudConfig)
        .sizes.get('')
        .then((data) => {
          this.logger.debug(`Project flavors datas: ${JSON.stringify(data)}`);
          resolve(
            data.sizes.map((flavor) => {
              return {
                id: flavor.id,
                name: flavor.slug,
                description: flavor.description,
                vcpus: flavor.vcpus,
                ram: flavor.memory,
                disk: flavor.disk,
                swap: flavor.swap,
                is_public: flavor.available,
                cloudprovider: CLOUD_PROVIDER_NAME,
              };
            })
          );
        })
        .catch((err) => {
          this.logger.error(err);
          reject(err);
        });
    });
  }

  getAllImages(
    cloudConfig: ICloudApiConfig,
    context?: Record<string, unknown>
  ): Promise<ICloudApiImage[]> {
    return new Promise<ICloudApiImage[]>((resolve, reject) => {
      if (
        this.configService.getOrElse(
          'cloud_providers.digitalocean.api_uses_snapshots',
          true
        )
      ) {
        this.getDOInstance(cloudConfig)
          .snapshots.get('')
          .then(async (data) => {
            this.logger.debug(
              `Project snapshots datas: ${JSON.stringify(data)}`
            );
            let snapshots: any[] = data.snapshots.map((snapshot) => {
              return {
                id: snapshot.id,
                name: snapshot.name,
                container_format: snapshot.container_format,
                owner: snapshot.owner_user_name,
                size: snapshot.size_gigabytes * 1024 * 1024 * 1024,
                status: snapshot.status,
                min_disk: snapshot.min_disk_size
                  ? snapshot.min_disk_size * 1024 * 1024 * 1024
                  : 0, //min disk on openstack always in GB, but api must return bytes
                visibility: snapshot.public ? 'public' : 'private',
                date: snapshot.created_at,
                tags: snapshot.tags,
                cloudprovider: CLOUD_PROVIDER_NAME,
              };
            });
            if (context.loadAll) {
              const imagesData = await this.getDOInstance(
                cloudConfig
              ).images.getAll('');

              snapshots = snapshots.concat(
                imagesData.images.map((img) => {
                  return {
                    id: img.id,
                    name: img.slug,
                    container_format: img.container_format,
                    owner: img.owner_user_name,
                    size: img.size,
                    status: img.status,
                    min_disk: img.min_disk_size
                      ? img.min_disk_size * 1024 * 1024 * 1024
                      : 0, //min disk on openstack always in GB, but apimust return bytes
                    min_ram: img.min_ram,
                    visibility: img.public ? 'public' : 'private',
                    date: img.created_at,
                    tags: img.tags,
                    cloudprovider: CLOUD_PROVIDER_NAME,
                  };
                })
              );
            }
            resolve(snapshots);
          })
          .catch((err) => {
            this.logger.error(err);
            reject(err);
          });
      } else {
        this.getDOInstance(cloudConfig)
          .images.getAll('')
          .then((data) => {
            this.logger.debug(`Project images datas: ${JSON.stringify(data)}`);
            resolve(
              data.images.map((img) => {
                return {
                  id: img.id,
                  name: img.slug,
                  container_format: img.container_format,
                  owner: img.owner_user_name,
                  size: img.size,
                  status: img.status,
                  min_disk: img.min_disk_size
                    ? img.min_disk_size * 1024 * 1024 * 1024
                    : 0, //min disk on openstack always in GB, but apimust return bytes
                  min_ram: img.min_ram,
                  visibility: img.public ? 'public' : 'private',
                  date: img.created_at,
                  tags: img.tags,
                  cloudprovider: CLOUD_PROVIDER_NAME,
                };
              })
            );
          })
          .catch((err) => {
            this.logger.error(err);
            reject(err);
          });
      }
    });
  }

  getAllDisks(cloudConfig: ICloudApiConfig): Promise<ICloudApiDisk[]> {
    return new Promise<ICloudApiDisk[]>((resolve, reject) => {
      this.getDOInstance(cloudConfig)
        .volumes.getAll('')
        .then((data) => {
          this.logger.debug(
            `Project volumes datas: ${JSON.stringify(data)}`,
            data
          );
          resolve(
            data.volumes.map((volume) => {
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
              };
            })
          );
        })
        .catch((err) => {
          this.logger.error(err);
          reject(err);
        });
    });
  }

  private getDOInstance(cloudConfig: ICloudApiConfig) {
    return new DigitalOcean(cloudConfig.password);
  }
}
