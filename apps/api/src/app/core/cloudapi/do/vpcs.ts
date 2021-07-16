

import { BaseModule } from "do-wrapper/dist/modules/base-module";
import RequestHelper from "do-wrapper/dist/request-helper";

export default class VPCs extends BaseModule {
    private basePath: string = 'vpcs';

    private baseOptions: any = {
        actionPath: `${this.basePath}/`,
    };

    constructor(pageSize: number, requestHelper: RequestHelper) {
        super(pageSize, requestHelper);
    }

    /**
     * Get all VPCs
     * @param [tagName] filter to only return VPCs with a given tag
     * @param [includeAll] return all VPCs, paginated (optional)
     * @param [page] the specific page of VPCs to return (optional)
     * @param [pageSize] the number of VPCs to return per page (optional)
     * @returns Promise
     */
    public getAll(tagName: string, includeAll: boolean = false, page: number = 1, pageSize: number = this.pageSize): Promise<any> {
        const requestOptions = this._getBasePaginatedRequestOptions({
            actionPath: this.basePath,
            key: 'vpcs',
            tagName: tagName,
            pageSize: pageSize,
            page: page,
            includeAll: includeAll,
        });

        return this._execute(requestOptions);
    }

    /**
     * Get a VPC using its identifier or slug
     * @param vpcIdOrSlug the identifier or slug of the VPC
     * @returns Promise
     */
    public getByIdOrSlug(vpcIdOrSlug: string): Promise<any> {
        return this._execute({
            actionPath: `${this.basePath}/${encodeURIComponent(vpcIdOrSlug)}`,
        });
    }

    /**
     * Delete a VPC using its identifier
     * @param vpcId the identifier of the VPC
     * @returns Promise
     */
    public deleteById(vpcId: string): Promise<any> {
        return this._execute({
            actionPath: `${this.basePath}/${encodeURIComponent(vpcId)}`,
            method: 'DELETE',
        });
    }

    /**
     * Rename a VPC
     * @param vpcId the identifier of the VPC
     * @param newName the new name to use
     * @returns Promise
     */
    public rename(vpcId: string, newName: string): Promise<any> {
        return this._execute({
            actionPath: `${this.basePath}/${encodeURIComponent(vpcId)}`,
            method: 'PUT',
            body: {
                name: newName,
            },
        });
    }

    /**
     * Get all actions for a VPC
     * @param vpcId the identifier of the VPC to retrieve actions for
     * @param [includeAll] return all VPCs, paginated (optional)
     * @param [page] the specific page of VPCs to return (optional)
     * @param [pageSize] the number of VPCs to return per page (optional)
     * @returns Promise
     */
    public getActions(vpcId: string, includeAll: boolean = false, page: number = 1, pageSize: number = this.pageSize): Promise<any> {
        const requestOptions = this._getBasePaginatedRequestOptions({
            actionPath: `${this.basePath}/${encodeURIComponent(vpcId)}/actions`,
            key: 'actions',
            pageSize: pageSize,
            page: page,
            includeAll: includeAll,
        });

        return this._execute(requestOptions);
    }

    /**
     * Get the details of an Action for a VPC
     * @param vpcId the identifier of the VPC
     * @param actionId the identifier of the Action
     * @returns Promise
     */
    public getActionById(vpcId: string, actionId: string): Promise<any> {
        return this._execute({
            actionPath: `${this.basePath}/${encodeURIComponent(vpcId)}/actions/${encodeURIComponent(actionId)}`,
        });
    }

    /**
     * Request an Action on a VPC
     * @param vpcId the identifier of the VPC
     * @param action the Action to request on the VPC
     * @returns Promise
     */
    public requestAction(vpcId: string, action: any): Promise<any> {
        return this._execute({
            actionPath: `${this.basePath}/${encodeURIComponent(vpcId)}/actions`,
            method: 'POST',
            body: action,
        });
    }
}