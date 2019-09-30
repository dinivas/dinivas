import { TerraformModuleResourceServiceBase } from '../terraform/terraform-module-resource-base.service';
import { ConsulDTO } from '@dinivas/dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsulService extends TerraformModuleResourceServiceBase<
  ConsulDTO
> {
  constructor(http: HttpClient) {
    super(http, 'consul');
  }
}
