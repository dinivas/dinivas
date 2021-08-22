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
  ICloudApiKeyPair,
} from '@dinivas/api-interfaces';
import { ConfigurationService } from '../../../core/config/configuration.service';
import { EC2 } from 'aws-sdk';

const CLOUD_PROVIDER_NAME = 'aws';
@Injectable()
export class AWSApiService implements ICloudApi {
  private readonly logger = new Logger(AWSApiService.name);

  constructor(private configService: ConfigurationService) {}

  getAllAvailabilityZones(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiAvailabilityZone[]> {
    return new Promise<ICloudApiAvailabilityZone[]>((resolve, reject) => {
      this.getEC2Instance(cloudConfig).describeAvailabilityZones(
        (err, data) => {
          if (err) reject(err);
          resolve(
            data.AvailabilityZones.map((az) => {
              return {
                hosts: az.RegionName,
                zoneName: az.ZoneName,
                zoneState: {
                  available: az.State === 'available',
                },
                cloudprovider: CLOUD_PROVIDER_NAME,
              };
            })
          );
        }
      );
    });
  }
  getProjectInfo(cloudConfig: ICloudApiConfig): Promise<ICloudApiInfo> {
    return new Promise<ICloudApiInfo>((resolve, reject) => {
      resolve({
        project_name: '',
        user_name: '',
      });
    });
  }

  getProjectQuota(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiProjectQuota> {
    return new Promise<ICloudApiProjectQuota>(async (resolve, reject) => {
      const floatingIps = await this.getProjectFloatingIps(cloudConfig);
      const instances = await this.getAllinstances(cloudConfig);
      const result: ICloudApiProjectQuota = {
        id: '',
        instances: {
          in_use: instances.length,
          limit: 0,
          reserved: 0,
          cloudprovider: CLOUD_PROVIDER_NAME,
        },
        cores: {
          in_use: instances
            .map((d) => d.cpuCoresCount)
            .reduce((accumulator, currentValue) => accumulator + currentValue),
          limit: 0,
          reserved: 0,
          cloudprovider: CLOUD_PROVIDER_NAME,
        },
        ram: {
          in_use: 0,
          limit: 0,
          reserved: 0,
          cloudprovider: CLOUD_PROVIDER_NAME,
        },
        floating_ips: {
          in_use: floatingIps.length,
          limit: 0,
          reserved: 0,
          cloudprovider: CLOUD_PROVIDER_NAME,
        },
      };
      resolve(result);
    });
  }

  getProjectFloatingIpPools(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiProjectFloatingIpPool[]> {
    return new Promise<ICloudApiProjectFloatingIpPool[]>((resolve, reject) => {
      this.getEC2Instance(cloudConfig).describePublicIpv4Pools((err, data) => {
        if (err) reject(err);
        resolve(
          data.PublicIpv4Pools.map((ipPool) => {
            return {
              name: ipPool.PoolId,
              cloudprovider: CLOUD_PROVIDER_NAME,
            } as ICloudApiProjectFloatingIpPool;
          })
        );
      });
    });
  }

  getProjectFloatingIps(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiProjectFloatingIp[]> {
    return new Promise<ICloudApiProjectFloatingIp[]>((resolve, reject) => {
      this.getEC2Instance(cloudConfig).describeAddresses((err, data) => {
        if (err) reject(err);
        resolve(
          data.Addresses.map((addr) => {
            return {
              id: addr.AllocationId,
              fixed_ip: addr.PrivateIpAddress,
              instance_id: addr.InstanceId,
              ip: addr.PublicIp,
              pool: addr.PublicIpv4Pool,
              cloudprovider: CLOUD_PROVIDER_NAME,
            };
          })
        );
      });
    });
  }

  getProjectNetworks(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiNetwork[]> {
    return new Promise<ICloudApiNetwork[]>((resolve, reject) => {
      this.getEC2Instance(cloudConfig).describeVpcs((err, data) => {
        if (err) reject(err);
        resolve(
          data.Vpcs.map((vpc) => {
            return {
              id: vpc.VpcId,
              cidr: vpc.CidrBlock,
              label: vpc.Tags.filter((v) => v.Key === 'Name')[0].Value,
              region: cloudConfig.region_name,
              cloudprovider: CLOUD_PROVIDER_NAME,
            } as ICloudApiNetwork;
          })
        );
      });
    });
  }

  getProjectKeyPairs(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiKeyPair[]> {
    return new Promise<ICloudApiKeyPair[]>((resolve, reject) => {
      this.getEC2Instance(cloudConfig).describeKeyPairs((err, data) => {
        if (err) reject(err);
        resolve(
          data.KeyPairs.map((keyPair) => {
            return {
              id: keyPair.KeyPairId,
              name: keyPair.KeyName,
              fingerprint: keyPair.KeyFingerprint,
              cloudprovider: CLOUD_PROVIDER_NAME,
            };
          })
        );
      });
    });
  }

  getProjectRouters(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiProjectRouter[]> {
    return new Promise<ICloudApiProjectRouter[]>((resolve, reject) => {
      this.getEC2Instance(cloudConfig).describeNatGateways((err, data) => {
        if (err) reject(err);
        resolve(
          data.NatGateways.map((gateway) => {
            return {
              id: gateway.NatGatewayId,
              name: gateway.Tags.filter((g) => g.Key === 'Name')[0].Value,
              description: gateway.NatGatewayId,
              status: gateway.State,
              tags: gateway.Tags.map((t) => `${t.Key}=${t.Value}`),
              cloudprovider: CLOUD_PROVIDER_NAME,
            };
          })
        );
      });
    });
  }

  getAllinstances(cloudConfig: ICloudApiConfig): Promise<ICloudApiInstance[]> {
    return new Promise<ICloudApiInstance[]>((resolve, reject) => {
      this.getEC2Instance(cloudConfig).describeInstances((err, data) => {
        if (err) reject(err);
        let result: ICloudApiInstance[] = [];
        data.Reservations.map((reservation) => {
          result = result.concat(
            result,
            reservation.Instances.map((instance) => {
              return {
                id: instance.InstanceId,
                name: instance.Tags.filter((t) => t.Key === 'Name')[0].Value,
                status: instance.State.Name,
                cpuCoresCount: instance.CpuOptions.CoreCount,
                created_date: instance.LaunchTime.toDateString(),
                adresses: [
                  {
                    addr: instance.PrivateIpAddress,
                    cloudprovider: CLOUD_PROVIDER_NAME,
                    type: 'Private',
                    version: 'IPV4',
                  },
                ],
                metadata: {
                  tags: instance.Tags.join(','),
                },
                cloudprovider: CLOUD_PROVIDER_NAME,
              } as ICloudApiInstance;
            })
          );
        });
        resolve(result);
      });
    });
  }

  getAllFlavors(cloudConfig: ICloudApiConfig): Promise<ICloudApiFlavor[]> {
    return new Promise<ICloudApiFlavor[]>((resolve, reject) => {
      this.getEC2Instance(cloudConfig).describeInstanceTypes(
        {
          Filters: [
            { Name: 'free-tier-eligible', Values: ['true', 'false'] },
            { Name: 'instance-type', Values: ['t2*', 't3*'] },
          ],
        },
        (err, data) => {
          if (err) reject(err);
          resolve(
            data.InstanceTypes.map((instanceType) => {
              return {
                id: instanceType.InstanceType,
                name: instanceType.InstanceType,
                description: instanceType.InstanceType,
                vcpus: instanceType.VCpuInfo.DefaultVCpus,
                ram: instanceType.MemoryInfo.SizeInMiB,
                disk: instanceType.InstanceStorageInfo?.TotalSizeInGB || 0,
                swap: 0,
                is_public: true,
                cloudprovider: CLOUD_PROVIDER_NAME,
              };
            })
          );
        }
      );
    });
  }

  getAllImages(cloudConfig: ICloudApiConfig): Promise<ICloudApiImage[]> {
    return new Promise<ICloudApiImage[]>((resolve, reject) => {
      this.getEC2Instance(cloudConfig).describeImages(
        {
          IncludeDeprecated: false,
          Filters: [
            {
              Name: 'tag:Owner',
              Values: ['Dinivas'],
            },
          ],
        },
        (err, data) => {
          if (err) reject(err);
          resolve(
            data.Images.map((img) => {
              return {
                id: img.ImageId,
                name: img.Name,
                container_format: img.CreationDate,
                owner: img.OwnerId,
                size: 0,
                status: img.State,
                min_disk: 0, //min disk on openstack always in GB, but apimust return bytes
                min_ram: 0,
                visibility: img.Public ? 'public' : 'private',
                date: img.CreationDate,
                tags: img.Tags.map((t) => `${t.Key}=${t.Value}`),
                cloudprovider: CLOUD_PROVIDER_NAME,
              } as ICloudApiImage;
            })
          );
        }
      );
    });
  }

  getAllDisks(cloudConfig: ICloudApiConfig): Promise<ICloudApiDisk[]> {
    return new Promise<ICloudApiDisk[]>((resolve, reject) => {
      this.getEC2Instance(cloudConfig).describeVolumes((err, data) => {
        if (err) reject(err);
        resolve(
          data.Volumes.map((volume) => {
            return {
              id: volume.VolumeId,
              name: volume.VolumeId,
              description: volume.VolumeId,
              size: volume.Size,
              status: volume.State,
              volumeType: volume.VolumeType,
              date: volume.CreateTime.toDateString(),
              metedata: volume.Tags,
              cloudprovider: CLOUD_PROVIDER_NAME,
            } as ICloudApiDisk;
          })
        );
      });
    });
  }

  private getEC2Instance(cloudConfig: ICloudApiConfig) {
    return new EC2({
      credentials: {
        accessKeyId: cloudConfig.username,
        secretAccessKey: cloudConfig.password,
      },
      region: cloudConfig.region_name,
    });
  }
}
