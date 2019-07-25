import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { Inject } from '@angular/core';

export class ApiInterceptor implements HttpInterceptor {
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.storage.has('dinivas-projectId')){
      request = request.clone({
        setHeaders: {
          'X-Dinivas-Project-Id': this.storage.get('dinivas-projectId')
        }
      });
    }
    return next.handle(request);
  }
}
