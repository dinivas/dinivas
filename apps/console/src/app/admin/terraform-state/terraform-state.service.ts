import { environment } from './../../../environments/environment';
import { TerraformStateDTO } from '@dinivas/dto';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TerraformStateService {
  constructor(private http: HttpClient) {}

  getTerraformState(httpParams: HttpParams): Observable<TerraformStateDTO[]> {
    return this.http.get<TerraformStateDTO[]>(
      `${environment.apiUrl}/terraform/state/all`,
      { params: httpParams }
    );
  }
}
