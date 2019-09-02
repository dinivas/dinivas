import { TerraformModuleResourceServiceBase } from '../terraform/terraform-module-resource-base.service';
import { JenkinsDTO } from '@dinivas/dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JenkinsService extends TerraformModuleResourceServiceBase<
  JenkinsDTO
> {
  constructor(http: HttpClient) {
    super(http, 'jenkins');
  }
}
