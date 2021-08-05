import { filter, Observable } from 'rxjs';
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
  receiveBackgroundJobFailedEvent(): Observable<{ jobId: number; error: any }> {
    return this.fromEvent(`background-job-failed`);
  }
  receiveBackgroundJobProgressEventForGivenJobId(
    planJobId: number
  ): Observable<{
    jobId: number;
    progress: number;
  }> {
    return this.fromEvent<{
      jobId: number;
      progress: number;
    }>(`background-job-progress`).pipe(
      filter((event) => Number(event.jobId) === planJobId)
    );
  }
  receiveBackgroundJobFailedEventForGivenJobId(planJobId: number) {
    return this.fromEvent<{ jobId: number; error: any }>(
      `background-job-failed`
    ).pipe(filter((event) => Number(event.jobId) === planJobId));
  }
}
