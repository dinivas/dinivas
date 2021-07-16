import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GalaxyService {
  constructor(private http: HttpClient) {}

  api(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/ansible-galaxy/api/`);
  }
}
