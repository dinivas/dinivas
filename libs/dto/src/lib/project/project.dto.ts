import { CloudproviderDTO } from '../cloudprovider/cloudprovider.dto';
export class ProjectDTO {

    id: number;
    name: string;
    code: string;
    description: string;
    cloud_provider: CloudproviderDTO;
    monitoring: boolean = false;
    logging: boolean = false;
    logging_stack: string;
}