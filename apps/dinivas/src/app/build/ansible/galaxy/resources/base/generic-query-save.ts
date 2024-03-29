import { AlertService } from './../../../../../core/alert/alert.service';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { BaseType } from './base-type';

import { GenericQuery } from './generic-query';

export class GenericQuerySave<
    ServiceType extends BaseType
> extends GenericQuery<ServiceType> {
    constructor(
        http: HttpClient,
        alertService: AlertService,
        url,
        serviceName,
    ) {
        super(http, alertService, url, serviceName);
    }

    save(object: ServiceType, urlExtras?: string): Observable<ServiceType> {
        let objectUrl = this.url;

        if (urlExtras) {
            objectUrl = this.append_to_url(this.url, urlExtras);
        }

        // eslint-disable-next-line @typescript-eslint/ban-types
        let httpResult: Observable<Object>;
        if (object.id) {
            httpResult = this.http.put<ServiceType>(
                `${objectUrl}/${object.id}/`,
                object,
                this.httpOptions,
            );
        } else {
            httpResult = this.http.post<ServiceType>(
                `${objectUrl}/`,
                object,
                this.httpOptions,
            );
        }

        return httpResult.pipe(
            tap((newObject: ServiceType) =>
                this.log(`Saved ${this.serviceName} w/ id=${newObject.id}`),
            ),
            catchError(this.handleError<ServiceType>('Save')),
        );
    }
}
