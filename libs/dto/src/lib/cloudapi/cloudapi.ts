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

export interface ICloudApiInstance {
  id: string;
  name: string;
}

export interface ICloudApiImage {
  id: string;
  name: string;
}

export interface ICloudApi {
  getProjectInfo(cloudConfig: ICloudApiConfig): Promise<ICloudApiInfo>;
  getAllinstances(cloudConfig: ICloudApiConfig): Promise<ICloudApiInstance[]>;
  getAllImages(loudConfig: ICloudApiConfig): Promise<ICloudApiImage[]>;
}
