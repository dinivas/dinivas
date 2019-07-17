import { Observable } from 'rxjs';
import { ProjectDTO, ICloudApiInstance } from '@dinivas/dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class InstancesService {
  constructor(private http: HttpClient) {}

  getInstances(httpParams: HttpParams): Observable<ICloudApiInstance[]> {
    return this.http.get<ICloudApiInstance[]>(
      `${environment.apiUrl}/compute/instances`,
      {
        params: httpParams
      }
    );
  }

  createInstance(cloudprovider: ProjectDTO): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/compute/instances`,
      cloudprovider
    );
  }

  updateInstance(cloudprovider: ProjectDTO): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/compute/instances/${cloudprovider.id}`,
      cloudprovider
    );
  }

  deleteInstance(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/compute/instances/${id}`);
  }
}
