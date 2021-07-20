import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SharedWebSocket extends Socket {
  constructor() {
    super({ url: `${environment.wsRootUrl}/dinivas-ws`, options: {} });
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

  receiveBackgroundJobStartEvent<T>(): Observable<T> {
    return this.fromEvent(`background-job-start`);
  }
  receiveBackgroundJobCompletedEvent(): Observable<{
    jobId: number;
    event: any;
  }> {
    return this.fromEvent(`background-job-completed`);
  }
  receiveBackgroundJobFailedEvent(): Observable<{ jobId: number; event: any }> {
    return this.fromEvent(`background-job-failed`);
  }
}