import { InstancesService } from './instances.service';
import { Observable, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';
import { Pagination, InstanceDTO } from '@dinivas/api-interfaces';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { TerraformModuleEntityInfo } from '../terraform/terraform-module-entity-info';

@Injectable({ providedIn: 'root' })
export class InstanceResolver implements Resolve<Pagination<InstanceDTO>> {
  constructor(private readonly instancesService: InstancesService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Pagination<InstanceDTO>> {
    return this.instancesService.get(new HttpParams());
  }
}

@Injectable({ providedIn: 'root' })
export class CurrentInstanceResolver
  implements Resolve<TerraformModuleEntityInfo<InstanceDTO>> {
  constructor(private readonly instancesService: InstancesService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TerraformModuleEntityInfo<InstanceDTO>> {
    const instanceIdString = <string>route.params['instanceId'];
    const instanceId = Number.parseInt(instanceIdString);
    return forkJoin([
      this.instancesService.getOne(instanceId),
      this.instancesService.getTerraformState(instanceId)
    ]).pipe(
      map(result => {
        return { entity: result[0], entityState: result[1] };
      })
    );
  }
}
