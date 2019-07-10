import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CloudproviderDTO } from '@dinivas/dto';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloudproviderService {
  constructor(private http: HttpClient) {}

  getCloudproviders(httpParams: HttpParams): Observable<CloudproviderDTO[]> {
    return this.http.get<CloudproviderDTO[]>(
      `${environment.apiUrl}/cloudproviders`, {params: httpParams}
    );
  }
}
