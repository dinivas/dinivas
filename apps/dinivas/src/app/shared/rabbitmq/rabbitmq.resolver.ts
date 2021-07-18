import { RabbitMQService } from './rabbitmq.service';
import { Observable, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';
import { RabbitMQDTO, Pagination } from '@dinivas/api-interfaces';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { TerraformModuleEntityInfo } from '../terraform/terraform-module-entity-info';

@Injectable({ providedIn: 'root' })
export class RabbitMQResolver implements Resolve<Pagination<RabbitMQDTO>> {
  constructor(private readonly rabbitMQService: RabbitMQService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Pagination<RabbitMQDTO>> {
    return this.rabbitMQService.get(new HttpParams());
  }
}

@Injectable({ providedIn: 'root' })
export class CurrentRabbitMQResolver
  implements Resolve<TerraformModuleEntityInfo<RabbitMQDTO>> {
  constructor(private readonly rabbitMQService: RabbitMQService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TerraformModuleEntityInfo<RabbitMQDTO>> {
    const rabbitMQIdString = <string>route.params['rabbitMQId'];
    const rabbitMQId = Number.parseInt(rabbitMQIdString);
    return forkJoin([
      this.rabbitMQService.getOne(rabbitMQId),
      this.rabbitMQService.getTerraformState(rabbitMQId)
    ]).pipe(
      map(result => {
        return { entity: result[0], entityState: result[1] };
      })
    );
  }
}
