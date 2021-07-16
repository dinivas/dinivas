import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { CONSTANT } from '@dinivas/api-interfaces';

export class ApiInterceptor implements HttpInterceptor {
  constructor(private storage: LocalStorageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // ProjectId header only for call to Dinivas Backend
    if (request.url.indexOf('/auth/realms/') === -1) {
      if (this.storage.retrieve(CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY)) {
        request = request.clone({
          setHeaders: {
            'X-Dinivas-Project-Id': this.storage
              .retrieve(CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY)
              .toString()
          }
        });
      }
    }
    return next.handle(request);
  }
}
