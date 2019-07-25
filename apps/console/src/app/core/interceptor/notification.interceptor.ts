import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { AlertService } from '../alert/alert.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class NotificationInterceptor implements HttpInterceptor {
  private alertService: AlertService;

  constructor(private injector: Injector) {
    setTimeout(() => (this.alertService = injector.get(AlertService)));
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (
            event instanceof HttpResponse &&
            event.headers.has('X-yacraApp-alert')
          ) {
            const alertKey = event.headers.get('X-yacraApp-alert');
            this.alertService.success(alertKey);
          }
        },
        (event: HttpEvent<any>) => {
          if (
            event instanceof HttpErrorResponse &&
            event.headers.has('X-Dinivas-Auth-Error')
          ) {
            const alertMessage = `[${event.status}] ${event.headers.get(
              'X-Dinivas-Auth-Error'
            )}, missing permissions: ${event.headers.get(
              'X-Dinivas-Auth-Required-Permissions'
            )}`;
            this.alertService.error(alertMessage);
          } else if (
            event instanceof HttpErrorResponse &&
            event.headers.has('X-yacraApp-alert')
          ) {
            const alertKey = event.headers.get('X-yacraApp-alert');
            this.alertService.error(alertKey);
          } else if (
            event instanceof HttpErrorResponse &&
            event.status &&
            event.statusText
          ) {
            this.alertService.error(
              `[${event.status}] ${event.statusText} ${
                event.error ? event.error.error : ''
              }`
            );
          }
        }
      )
    );
  }
}
