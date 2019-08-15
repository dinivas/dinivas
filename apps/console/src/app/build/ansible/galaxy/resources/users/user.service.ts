import { AlertService } from './../../../../../core/alert/alert.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from './user';

import { GenericQuerySave } from '../base/generic-query-save';

@Injectable({
    providedIn: 'root'
  })
export class UserService extends GenericQuerySave<User> {
    constructor(http: HttpClient, alertService: AlertService) {
        super(http, alertService, '/api/v1/users', 'user');
    }

    getToken(userId: number): Observable<any> {
        return this.http.get(`${this.url}/${userId}/token/`).pipe(
            map(response => response['token']),
            tap(_ => this.log('fetched token')),
            catchError(this.handleError('Query', [])),
        );
    }

    resetToken(userId: number): Observable<any> {
        return this.http.put(`${this.url}/${userId}/token/`, '').pipe(
            map(response => response['token']),
            tap(_ => this.log('reset token')),
            catchError(this.handleError('Query', [])),
        );
    }
}
