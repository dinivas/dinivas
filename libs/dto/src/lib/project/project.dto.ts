import { CloudproviderDTO } from '../cloudprovider/cloudprovider.dto';
export class ProjectDTO {

    id: number;
    name: string;
    code: string;
    description: string;
    cloud_provider: CloudproviderDTO;
}