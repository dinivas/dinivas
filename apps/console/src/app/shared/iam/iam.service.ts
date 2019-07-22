import { Observable } from 'rxjs/';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IamService {

  constructor(private http: HttpClient) {}

  getAllUsers(httpParams: HttpParams): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/iam/members`,
      {
        params: httpParams
      }
    );
  }
}
