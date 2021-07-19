import { Observable } from 'rxjs';
import { ICloudApiImage, ModuleImageToBuildDTO } from '@dinivas/api-interfaces';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  constructor(private http: HttpClient) {}

  getImages(
    cloudProviderId: number,
    httpParams: HttpParams
  ): Observable<ICloudApiImage[]> {
    return this.http.get<ICloudApiImage[]>(
      `${environment.apiUrl}/compute/images/by_cloudprovider/${cloudProviderId}`,
      {
        params: httpParams,
      }
    );
  }

  buildImage(imageToBuild: ModuleImageToBuildDTO): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/compute/images/build`,
      imageToBuild
    );
  }

  deleteImage(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/compute/images/${id}`);
  }
}
