export interface ModuleImageToBuildDTO {
  cloudproviderId: number;
  cloudprovider: string;
  availability_zone: string;
  module_name: string;
  image_name: string;
  source_ssh_user: string;
  network: string;
  floating_ip_network: string;
  source_cloud_image: string;
  source_cloud_flavor: string;
  image_tags: string[];
  override_image_if_exist: boolean;
}
