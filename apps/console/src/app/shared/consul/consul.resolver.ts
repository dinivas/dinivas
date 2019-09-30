import { ConsulService } from './consul.service';
import { Observable } from 'rxjs/';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';
import { ConsulDTO, Pagination } from '@dinivas/dto';
import { HttpParams } from '@angular/common/http';

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
export class CurrentConsulResolver implements Resolve<ConsulDTO> {
  constructor(private readonly consulService: ConsulService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ConsulDTO> {
    const consulId = <string>route.params['consulId'];
    return this.consulService.getOne(Number.parseInt(consulId));
  }
}
