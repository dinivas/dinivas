import { AlertService } from './../../../../../core/alert/alert.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    CollectionUpload,
    CollectionList,
    CollectionDetail,
} from './collection';

import { ServiceBase } from '../base/service-base';
import { GenericQuerySave } from '../base/generic-query-save';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
export class CollectionUploadService extends ServiceBase {
    constructor(http: HttpClient, alertService: AlertService) {
        super(http, alertService, '/api/v2/collections', 'collection');
    }

    upload(artifact: CollectionUpload): Observable<any> {
        const formData = new FormData();
        formData.append('file', artifact.file);
        // formData.append('sha256', artifact.sha256);

        const req = new HttpRequest('POST', this.url + '/', formData, {
            reportProgress: true,
        });

        return this.http
            .request(req)
            .pipe(
                tap((newObject: any) =>
                    this.log(`Uploaded new ${this.serviceName}`),
                ),
            );
    }
}

@Injectable({
    providedIn: 'root'
  })
export class CollectionListService extends GenericQuerySave<CollectionList> {
    constructor(http: HttpClient, alertService: AlertService) {
        super(
            http,
            alertService,
            '/api/internal/ui/collections',
            'collection',
        );
    }
}

@Injectable({
    providedIn: 'root'
  })
export class CollectionDetailService extends ServiceBase {
    constructor(http: HttpClient, alertService: AlertService) {
        super(
            http,
            alertService,
            '/api/internal/ui/collections',
            'collection',
        );
    }

    get(namespace: string, name: string): Observable<CollectionDetail> {
        return this.http
            .get<CollectionDetail>(`${this.url}/${namespace}/${name}`)
            .pipe(
                tap(_ => this.log('fetched collection detail')),
                catchError(this.handleError('Get', {} as CollectionDetail)),
            );
    }
}
