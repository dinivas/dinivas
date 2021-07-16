export class CloudproviderType {
    code: string;
    label: string;
}

export const CLOUD_TYPES: CloudproviderType[]= [
    {
        code: 'openstack',
        label: 'Openstack'
    },
    {
        code: 'digitalocean',
        label: 'Digital Ocean'
    },
    {
        code: 'aws',
        label: 'AWS'
    },
    {
        code: 'gcp',
        label: 'Google Cloud plateform'
    },
    {
        code: 'azure',
        label: 'Azure'
    }
]