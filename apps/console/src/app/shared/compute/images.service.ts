import { Observable } from 'rxjs';
import { ProjectDTO, ICloudApiImage } from '@dinivas/dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  constructor(private http: HttpClient) {}

  getImages(httpParams: HttpParams): Observable<ICloudApiImage[]> {
    return this.http.get<ICloudApiImage[]>(
      `${environment.apiUrl}/compute/images`,
      {
        params: httpParams
      }
    );
  }

  createImage(cloudprovider: ProjectDTO): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/compute/images`,
      cloudprovider
    );
  }

  updateImage(cloudprovider: ProjectDTO): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/compute/images/${cloudprovider.id}`,
      cloudprovider
    );
  }

  deleteImage(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/compute/images/${id}`);
  }
}
