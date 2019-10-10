import { RabbitMQService } from './rabbitmq.service';
import { Observable } from 'rxjs/';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';
import { RabbitMQDTO, Pagination } from '@dinivas/dto';
import { HttpParams } from '@angular/common/http';

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
export class CurrentRabbitMQResolver implements Resolve<RabbitMQDTO> {
  constructor(private readonly rabbitMQService: RabbitMQService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<RabbitMQDTO> {
    const rabbitMQId = <string>route.params['rabbitMQId'];
    return this.rabbitMQService.getOne(Number.parseInt(rabbitMQId));
  }
}
