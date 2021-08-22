import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CloudproviderDTO,
  ICloudApiProjectFloatingIpPool,
  ICloudApiProjectRouter,
  ICloudApiFlavor,
  ICloudApiImage,
  ICloudApiAvailabilityZone,
  ICloudApiNetwork,
  ICloudApiProjectFloatingIp,
  ICloudApiKeyPair
} from '@dinivas/api-interfaces';
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

  getOneCloudProviderRawValue(id: number): Observable<CloudproviderDTO> {
    return this.http.get<CloudproviderDTO>(
      `${environment.apiUrl}/cloudproviders/${id}/raw`
    );
  }

  getCloudProviderFloatingIpPools(
    id: number
  ): Observable<ICloudApiProjectFloatingIpPool[]> {
    return this.http.get<ICloudApiProjectFloatingIpPool[]>(
      `${environment.apiUrl}/cloudproviders/${id}/floating_ip_pools`
    );
  }

  getCloudProviderFloatingIps(
    id: number
  ): Observable<ICloudApiProjectFloatingIp[]> {
    return this.http.get<ICloudApiProjectFloatingIp[]>(
      `${environment.apiUrl}/cloudproviders/${id}/floating_ips`
    );
  }

  getCloudProviderFlavors(id: number): Observable<ICloudApiFlavor[]> {
    return this.http.get<ICloudApiFlavor[]>(
      `${environment.apiUrl}/cloudproviders/${id}/flavors`
    );
  }
  getCloudProviderKeyPairs(id: number): Observable<ICloudApiKeyPair[]> {
    return this.http.get<ICloudApiKeyPair[]>(
      `${environment.apiUrl}/cloudproviders/${id}/keypairs`
    );
  }

  getCloudProviderAvailabilityZones(
    id: number
  ): Observable<ICloudApiAvailabilityZone[]> {
    return this.http.get<ICloudApiAvailabilityZone[]>(
      `${environment.apiUrl}/cloudproviders/${id}/availability_zones`
    );
  }

  getCloudProviderImages(id: number): Observable<ICloudApiImage[]> {
    return this.http.get<ICloudApiImage[]>(
      `${environment.apiUrl}/cloudproviders/${id}/images`
    );
  }

  getCloudProviderNetworks(id: number): Observable<ICloudApiNetwork[]> {
    return this.http.get<ICloudApiNetwork[]>(
      `${environment.apiUrl}/cloudproviders/${id}/networks`
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
