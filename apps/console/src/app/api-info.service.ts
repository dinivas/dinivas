import { IServerInfo } from '@dinivas/model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/console/src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiInfoService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public getApiServerInfo(): Observable<IServerInfo> {
    return this.httpClient.get<IServerInfo>(`${environment.apiUrl}/info`);
  }
}
