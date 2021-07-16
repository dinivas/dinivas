import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class TerraformWebSocket extends Socket {
  constructor() {
    super({ url: `${environment.wsRootUrl}/terraform`, options: {} });
  }

  receivePlanEvent<T>(code: string): Observable<T> {
    return this.fromEvent(`planEvent-${code}`);
  }

  receivePlanErrorEvent<T>(code: string): Observable<T> {
    return this.fromEvent(`planEvent-${code}-error`);
  }

  receiveApplyEvent<T>(code: string): Observable<T> {
    return this.fromEvent(`applyEvent-${code}`);
  }

  receiveApplyErrorEvent<T>(code: string): Observable<T> {
    return this.fromEvent(`applyEvent-${code}-error`);
  }
}
