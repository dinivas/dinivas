export interface TerraformStateDTO {
    id: number;
    projectCode: string;
    module: string;
    state: string;
    lockId: string;
    lockVersion: string;
    lockOperation: string;
    lockDate: string;
    lockWho: string;
    lockInfo: string;
}