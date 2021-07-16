import { TerraformModuleResourceServiceBase } from '../terraform/terraform-module-resource-base.service';
import { RabbitMQDTO } from '@dinivas/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RabbitMQService extends TerraformModuleResourceServiceBase<
  RabbitMQDTO
> {
  constructor(http: HttpClient) {
    super(http, 'rabbitmq');
  }
}
