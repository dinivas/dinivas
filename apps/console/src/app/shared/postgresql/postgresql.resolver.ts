import { PostgresqlService } from './postgresql.service';
import { Observable } from 'rxjs/';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';
import { Pagination, PostgresqlDTO } from '@dinivas/dto';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PostgresqlResolver implements Resolve<Pagination<PostgresqlDTO>> {
  constructor(private readonly postgresqlService: PostgresqlService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Pagination<PostgresqlDTO>> {
    return this.postgresqlService.get(new HttpParams());
  }
}

@Injectable({ providedIn: 'root' })
export class CurrentPostgresqlResolver implements Resolve<PostgresqlDTO> {
  constructor(private readonly postgresqlService: PostgresqlService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<PostgresqlDTO> {
    const postgresqlId = <string>route.params['postgresqlId'];
    return this.postgresqlService.getOne(Number.parseInt(postgresqlId));
  }
}
