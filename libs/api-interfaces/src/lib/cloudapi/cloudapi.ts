export interface ICloudApiConfig {
  auth_url: string;
  username: string;
  password: string;
  project_id: string;
  region_name?: string;
}

export interface ICloudApiInfo {
  user_name: string;
  project_name: string;
}

// Project

export interface ICloudApiProjectQuotaDetail {
  in_use: number;
  limit: number;
  reserved: number;
}

export interface ICloudApiProjectQuota {
  id: string;
  instances: ICloudApiProjectQuotaDetail;
  cores: ICloudApiProjectQuotaDetail;
  ram: ICloudApiProjectQuotaDetail;
  floating_ips: ICloudApiProjectQuotaDetail;
}

// Instance

export interface ICloudApiInstanceAdress {
  addr: string;
  type: string;
  version: string;
}

export interface ICloudApiInstance {
  id: string;
  name: string;
  status: string;
  adresses: ICloudApiInstanceAdress[];
  keys: string[];
  created_date: string;
  updated_date: string;
  metadata: any;
}

export interface ICloudApiImage {
  id: string;
  name: string;
  container_format: string;
  owner: string;
  size: number;
  status: string;
  min_disk: number;
  min_ram: number;
  visibility: string;
  date: string;
  tags: string[];
}

// Flavors

export interface ICloudApiFlavor {
  id: string;
  name: string;
  description: string;
  vcpus: number;
  ram: number;
  disk: number;
  swap: number;
  is_public: boolean;
}

// Disks

export interface ICloudApiDisk {
  id: string;
  name: string;
  size: number;
  status: string;
  volumeType: string;
  date: string;
  metedata: unknown;
}

export interface ICloudApiProjectFloatingIpPool {
  name: string;
}

export interface ICloudApiProjectFloatingIp {
  fixed_ip: string;
  id: string;
  instance_id: string;
  ip: string;
  pool: string;
}

export interface ICloudApiProjectRouter {
  id: string;
  name: string;
  description: string;
  status: string;
  tags: string[];
}

// AvailabilityZone

export interface ICloudApiAvailabilityZone {
  hosts: string;
  zoneName: string;
  zoneState: {
    available: boolean;
  };
}

export interface ICloudApiNetwork {
  id: string;
  cidr: string;
  label: string;
}

export interface ICloudApi {
  // Project infos
  getProjectInfo(cloudConfig: ICloudApiConfig): Promise<ICloudApiInfo>;
  getProjectQuota(cloudConfig: ICloudApiConfig): Promise<ICloudApiProjectQuota>;
  getProjectFloatingIpPools(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiProjectFloatingIpPool[]>;
  getProjectFloatingIps(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiProjectFloatingIp[]>;
  getProjectNetworks(cloudConfig: ICloudApiConfig): Promise<ICloudApiNetwork[]>;
  getProjectRouters(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiProjectRouter[]>;

  //Compute infos
  getAllinstances(cloudConfig: ICloudApiConfig): Promise<ICloudApiInstance[]>;
  getAllFlavors(cloudConfig: ICloudApiConfig): Promise<ICloudApiFlavor[]>;
  getAllImages(cloudConfig: ICloudApiConfig): Promise<ICloudApiImage[]>;
  getAllDisks(cloudConfig: ICloudApiConfig): Promise<ICloudApiDisk[]>;
  getAllAvailabilityZones(
    cloudConfig: ICloudApiConfig
  ): Promise<ICloudApiAvailabilityZone[]>;
}
