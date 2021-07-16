import { environment } from './../environments/environment';
import { IServerInfo } from '@dinivas/api-interfaces';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiInfoService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public getApiServerInfo(): Observable<IServerInfo> {
    return this.httpClient.get<IServerInfo>(`${environment.apiUrl}/server-info`);
  }
}
