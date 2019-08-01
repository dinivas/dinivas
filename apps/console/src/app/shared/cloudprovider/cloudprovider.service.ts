import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CloudproviderDTO, ICloudApiProjectFloatingIpPool, ICloudApiProjectRouter } from '@dinivas/dto';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloudproviderService {
  constructor(private http: HttpClient) {}

  getCloudproviders(httpParams: HttpParams): Observable<CloudproviderDTO[]> {
    return this.http.get<CloudproviderDTO[]>(
      `${environment.apiUrl}/cloudproviders`,
      { params: httpParams }
    );
  }

  getOneCloudProvider(id: number): Observable<CloudproviderDTO> {
    return this.http.get<CloudproviderDTO>(
      `${environment.apiUrl}/cloudproviders/${id}`
    );
  }

  getCloudProviderFloatingIps(id: number): Observable<ICloudApiProjectFloatingIpPool[]> {
    return this.http.get<ICloudApiProjectFloatingIpPool[]>(
      `${environment.apiUrl}/cloudproviders/${id}/floating_ip_pools`
    );
  }

  getCloudProviderRouters(id: number): Observable<ICloudApiProjectRouter[]> {
    return this.http.get<ICloudApiProjectRouter[]>(
      `${environment.apiUrl}/cloudproviders/${id}/routers`
    );
  }

  createCloudprovider(cloudprovider: CloudproviderDTO): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/cloudproviders`,
      cloudprovider
    );
  }

  updateCloudprovider(cloudprovider: CloudproviderDTO): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/cloudproviders/${cloudprovider.id}`,
      cloudprovider
    );
  }

  deleteCloudprovider(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/cloudproviders/${id}`);
  }

  checkCloudproviderConnection(
    cloudprovider: CloudproviderDTO
  ): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/cloudproviders/${
        cloudprovider.id
      }/check_connection`
    );
  }
}
