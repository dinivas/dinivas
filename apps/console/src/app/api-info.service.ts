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

  public getApiServerInfo(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/info`);
  }
}
