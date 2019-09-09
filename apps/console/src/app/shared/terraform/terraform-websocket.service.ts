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

  receivePlanEvent(code: string) {
    return this.fromEvent(`planEvent-${code}`);
  }

  receivePlanErrorEvent(code: string) {
    return this.fromEvent(`planEvent-${code}-error`);
  }

  receiveApplyEvent(code: string) {
    return this.fromEvent(`applyEvent-${code}`);
  }

  receiveApplyErrorEvent(code: string) {
    return this.fromEvent(`applyEvent-${code}-error`);
  }
}
