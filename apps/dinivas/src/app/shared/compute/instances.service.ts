import { TerraformModuleResourceServiceBase } from './../terraform/terraform-module-resource-base.service';
import { Observable } from 'rxjs';
import { ProjectDTO, ICloudApiInstance, InstanceDTO } from '@dinivas/api-interfaces';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class InstancesService extends TerraformModuleResourceServiceBase<
  InstanceDTO
> {
  constructor(http: HttpClient) {
    super(http, 'compute/instances');
  }

  getInstances(httpParams: HttpParams): Observable<InstanceDTO[]> {
    return this.http.get<InstanceDTO[]>(
      `${environment.apiUrl}/compute/instances`,
      {
        params: httpParams
      }
    );
  }

  createInstance(cloudprovider: ProjectDTO): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/compute/instances`,
      cloudprovider
    );
  }

  updateInstance(cloudprovider: ProjectDTO): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/compute/instances/${cloudprovider.id}`,
      cloudprovider
    );
  }

  deleteInstance(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/compute/instances/${id}`);
  }
}
