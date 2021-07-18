import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRepresentation } from '@dinivas/api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class IamService {
  constructor(private http: HttpClient) {}

  getOneUser(memberId: string): Observable<UserRepresentation> {
    return this.http.get<UserRepresentation>(
      `${environment.apiUrl}/iam/members/${memberId}`
    );
  }

  getAllUsers(httpParams: HttpParams): Observable<UserRepresentation[]> {
    return this.http.get<UserRepresentation[]>(
      `${environment.apiUrl}/iam/members`,
      {
        params: httpParams
      }
    );
  }
}
