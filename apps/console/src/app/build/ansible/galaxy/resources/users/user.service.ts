import { environment } from './../../../../../../environments/environment';
import { AlertService } from './../../../../../core/alert/alert.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  headers: HttpHeaders = new HttpHeaders().set(
    'Content-Type',
    'application/json'
  );
  meUrl = `${environment.apiUrl}/ansible-galaxy/api/v1/me/`;

  me(): Observable<IMe> {
    return this.http.get<IMe>(this.meUrl, { headers: this.headers }).pipe(
      map(result => {
        return result;
      })
    );
  }

  getToken(userId: number): Observable<any> {
    return this.http.get(`${this.url}/${userId}/token/`).pipe(
      map(response => response['token']),
      tap(_ => this.log('fetched token')),
      catchError(this.handleError('Query', []))
    );
  }

  resetToken(userId: number): Observable<any> {
    return this.http.put(`${this.url}/${userId}/token/`, '').pipe(
      map(response => response['token']),
      tap(_ => this.log('reset token')),
      catchError(this.handleError('Query', []))
    );
  }
}

export interface IMe {
  url: string;
  related: object;
  summary_fields: object;
  id: number;
  authenticated: boolean;
  staff: boolean;
  username: string;
  created: string;
  modified: string;
  active: boolean;
}
