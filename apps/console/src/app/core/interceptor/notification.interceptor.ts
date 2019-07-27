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
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { CONSTANT } from '@dinivas/dto';

export class NotificationInterceptor implements HttpInterceptor {
  constructor(
    private alertService: AlertService,
    private router: Router,
    private storage: LocalStorageService
  ) {
    setTimeout(() => {
      //this.alertService = injector.get(AlertService);
      //injector.get(StorageService)
    });
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
            event.headers.has(CONSTANT.HTTP_HEADER_AUTH_ERROR)
          ) {
            const alertMessage = `[${event.status}] ${event.headers.get(
              CONSTANT.HTTP_HEADER_AUTH_ERROR
            )}, missing permissions: ${event.headers.get(
              CONSTANT.HTTP_HEADER_AUTH_REQUIRED_PERMISSIONS
            )}`;
            this.alertService.error(alertMessage);
          } else if (
            event instanceof HttpErrorResponse &&
            event.headers.has(CONSTANT.HTTP_HEADER_PROJECT_UNKNOWN)
          ) {
            this.alertService.error(
              `The project with id: ${event.headers.get(
                CONSTANT.HTTP_HEADER_PROJECT_UNKNOWN
              )} does not exist!`
            );
            this.storage.clear(CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY);
            this.router.navigate(['/']);
          } else if (
            event instanceof HttpErrorResponse &&
            event.status &&
            event.statusText
          ) {
            this.alertService.error(
              `[${event.status}] ${event.statusText} ${
                event.message ? event.message : ''
              }`
            );
          }
        }
      )
    );
  }
}
