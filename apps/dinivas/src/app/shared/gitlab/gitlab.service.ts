import { TerraformModuleResourceServiceBase } from '../terraform/terraform-module-resource-base.service';
import { GitlabDTO } from '@dinivas/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GitlabService extends TerraformModuleResourceServiceBase<
  GitlabDTO
> {
  constructor(http: HttpClient) {
    super(http, 'gitlab');
  }
}
