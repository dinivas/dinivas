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

  receivePlanOutput(projectCode: string) {
    return this.fromEvent('plan-output');
  }
}
