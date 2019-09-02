import { TerraformModuleResourceServiceBase } from '../terraform/terraform-module-resource-base.service';
import { PostgresqlDTO } from '@dinivas/dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostgresqlService extends TerraformModuleResourceServiceBase<
  PostgresqlDTO
> {
  constructor(http: HttpClient) {
    super(http, 'postgresql');
  }
}
