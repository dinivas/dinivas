import { ConsulService } from './consul.service';
import { Observable, forkJoin } from 'rxjs/';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';
import { ConsulDTO, Pagination } from '@dinivas/dto';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { TerraformModuleEntityInfo } from '../terraform/terraform-module-entity-info';

@Injectable({ providedIn: 'root' })
export class ConsulResolver implements Resolve<Pagination<ConsulDTO>> {
  constructor(private readonly consulService: ConsulService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Pagination<ConsulDTO>> {
    return this.consulService.get(new HttpParams());
  }
}

@Injectable({ providedIn: 'root' })
export class CurrentConsulResolver
  implements Resolve<TerraformModuleEntityInfo<ConsulDTO>> {
  constructor(private readonly consulService: ConsulService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TerraformModuleEntityInfo<ConsulDTO>> {
    const consulIdString = <string>route.params['consulId'];
    const consulId = Number.parseInt(consulIdString);
    return forkJoin([
      this.consulService.getOne(consulId),
      this.consulService.getTerraformState(consulId)
    ]).pipe(
      map(result => {
        return { entity: result[0], entityState: result[1] };
      })
    );
  }
}
