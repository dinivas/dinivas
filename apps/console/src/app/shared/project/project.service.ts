import { Observable } from 'rxjs';
import { ProjectDTO } from '@dinivas/dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  getProjects(httpParams: HttpParams): Observable<ProjectDTO[]> {
    return this.http.get<ProjectDTO[]>(`${environment.apiUrl}/projects`, {
      params: httpParams
    });
  }

  createProject(cloudprovider: ProjectDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}/projects`, cloudprovider);
  }

  updateProject(cloudprovider: ProjectDTO): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/projects/${cloudprovider.id}`,
      cloudprovider
    );
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/projects/${id}`);
  }
}
