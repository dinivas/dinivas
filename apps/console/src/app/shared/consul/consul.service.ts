import { environment } from './../../../environments/environment';
import { TerraformModuleResourceServiceBase } from '../terraform/terraform-module-resource-base.service';
import { ConsulDTO } from '@dinivas/dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsulService extends TerraformModuleResourceServiceBase<
  ConsulDTO
> {
  constructor(http: HttpClient) {
    super(http, 'consul');
  }

  getOneByCode(code: string): Observable<ConsulDTO> {
    return this.http.get<ConsulDTO>(
      `${environment.apiUrl}/consul/by_code/${code}`
    );
  }
}
