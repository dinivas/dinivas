import { environment } from './../../../../../../environments/environment';
import { AlertService } from './../../../../../core/alert/alert.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

export class ServiceBase {
  protected ObjectType: any;

  constructor(
    protected http: HttpClient,
    protected alertService: AlertService,
    protected url?,
    protected serviceName?
  ) {
    if (url) {
      this.url = `${environment.apiUrl}/ansible-galaxy${url}`;
    }
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  append_to_url(url: string, extras: string) {
    // Concatenate two urls

    let u1;
    let u2;

    // remove extra slashes.
    if (url[url.length - 1] === '/') {
      u1 = url.substring(0, url.length - 1);
    } else {
      u1 = url;
    }

    if (extras[extras.length - 1] === '/') {
      u2 = extras.substring(1, extras.length);
    } else {
      u2 = extras;
    }

    return `${u1}/${u2}`;
  }

  handleError<T>(operation = '', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed, error:`, error);
      this.log(`${operation} ${this.serviceName} error: ${error.message}`);
      const apiResponse = error.error;

      // If we are saving data, we expect the error message to have the following shape
      // {field_name: ['Message 1', 'Message 2']}
      // because this is the error format that Django Rest serializer return
      if (
        typeof apiResponse === 'object' &&
        Object.keys(apiResponse).length > 0
      ) {
        for (const field of Object.keys(apiResponse)) {
          let errorMessage = '';
          if (typeof apiResponse[field] === 'string') {
            errorMessage = apiResponse[field];
          } else {
            errorMessage = apiResponse[field].join(' ');
          }
          this.alertService.error(`${field} ${errorMessage}`);
        }
      } else if (typeof apiResponse === 'string') {
        this.alertService.error(
          `${operation} ${this.serviceName} failed: ${apiResponse}`
        );
      } else {
        this.alertService.error(`${operation} ${this.serviceName} failed:`);
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  log(message: string) {
    console.log(`${this.serviceName}: ${message}`);
  }
}
