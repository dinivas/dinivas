import { Observable } from 'rxjs';
import { ProjectDTO, ICloudApiInstance, ICloudApiFlavor } from '@dinivas/api-interfaces';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FlavorsService {
  constructor(private http: HttpClient) {}

  getFlavors(httpParams: HttpParams): Observable<ICloudApiFlavor[]> {
    return this.http.get<ICloudApiFlavor[]>(
      `${environment.apiUrl}/compute/flavors`,
      {
        params: httpParams
      }
    );
  }
}
