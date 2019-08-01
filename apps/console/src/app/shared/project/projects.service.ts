import { Observable } from 'rxjs';
import { ProjectDTO, ICloudApiProjectQuota } from '@dinivas/dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  constructor(private http: HttpClient) {}

  getProjects(httpParams: HttpParams): Observable<ProjectDTO[]> {
    return this.http.get<ProjectDTO[]>(`${environment.apiUrl}/projects`, {
      params: httpParams
    });
  }

  createProject(project: ProjectDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}/projects`, project);
  }

  planProject(project: ProjectDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}/projects/plan`, project);
  }

  updateProject(project: ProjectDTO): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/projects/${project.id}`,
      project
    );
  }

  getOneProject(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/projects/${id}`);
  }

  getProjectQuota(id: number): Observable<ICloudApiProjectQuota> {
    return this.http.get<ICloudApiProjectQuota>(
      `${environment.apiUrl}/projects/${id}/quota`
    );
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/projects/${id}`);
  }
}
