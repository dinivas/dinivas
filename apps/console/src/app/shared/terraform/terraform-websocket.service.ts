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

  receivePlanEvent(projectCode: string) {
    return this.fromEvent(`planEvent-${projectCode}`);
  }

  receiveApplyEvent(projectCode: string) {
    return this.fromEvent(`applyEvent-${projectCode}`);
  }
}
