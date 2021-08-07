export class CloudproviderType {
  code: string;
  svgIcon: string;
  label: string;
}

export const CLOUD_TYPES: CloudproviderType[] = [
  {
    code: 'openstack',
    svgIcon: 'openstack',
    label: 'Openstack',
  },
  {
    code: 'digitalocean',
    svgIcon: 'digitalocean',
    label: 'Digital Ocean',
  },
  {
    code: 'aws',
    svgIcon: 'aws',
    label: 'AWS',
  },
  {
    code: 'gcp',
    svgIcon: 'gcp',
    label: 'Google Cloud plateform',
  },
  {
    code: 'azure',
    svgIcon: 'azure',
    label: 'Azure',
  },
];
