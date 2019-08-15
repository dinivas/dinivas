import { environment } from './../../../../../../environments/environment';
import { AlertService } from './../../../../../core/alert/alert.service';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PagedResponse } from '../paged-response';
import { ContentType } from './content-type';

@Injectable({
    providedIn: 'root'
  })
export class ContentTypeService {
    private url = `${environment.apiUrl}/ansible-galaxy/api/v1/content_types`;

    constructor(
        private http: HttpClient,
        private alertService: AlertService,
    ) {}

    query(params?: any): Observable<ContentType[]> {
        return this.http
            .get<PagedResponse>(this.url + '/', { params: params })
            .pipe(
                map(response => response.results),
                tap(_ => this.log('fetched content types')),
                catchError(this.handleError('Query', [] as ContentType[])),
            );
    }

    private handleError<T>(operation = '', result?: T) {
        return (error: any): Observable<T> => {
            console.error(`${operation} failed, error:`, error);
            this.log(`${operation} repository error: ${error.message}`);
            this.alertService.error(
                `${operation} repository failed:`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    private log(message: string) {
        console.log('ContentTypeService: ' + message);
    }
}
