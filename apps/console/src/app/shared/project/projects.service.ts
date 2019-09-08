import { Observable, Subject } from 'rxjs';
import {
  ProjectDTO,
  ICloudApiProjectQuota,
  ApplyModuleDTO,
  ICloudApiFlavor,
  ICloudApiImage
} from '@dinivas/dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private _currentSelectedProject = new Subject<ProjectDTO>();
  currentSelectedProject = this._currentSelectedProject.asObservable();
  constructor(private http: HttpClient) {}

  setCurrentSelectedProject(currentSelectedProject: ProjectDTO): void {
    this._currentSelectedProject.next(currentSelectedProject);
  }

  getProjects(httpParams: HttpParams): Observable<ProjectDTO[]> {
    return this.http.get<ProjectDTO[]>(`${environment.apiUrl}/projects`, {
      params: httpParams
    });
  }

  getProjectFlavors(id: number): Observable<ICloudApiFlavor[]> {
    return this.http.get<ICloudApiFlavor[]>(
      `${environment.apiUrl}/projects/${id}/flavors`
    );
  }

  getProjectImages(id: number): Observable<ICloudApiImage[]> {
    return this.http.get<ICloudApiImage[]>(
      `${environment.apiUrl}/projects/${id}/images`
    );
  }

  createProject(project: ProjectDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}/projects`, project);
  }

  planProject(project: ProjectDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}/projects/plan`, project);
  }

  applyProjectPlan(
    applyProjectDTO: ApplyModuleDTO<ProjectDTO>
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/projects/apply-plan`,
      applyProjectDTO
    );
  }

  updateProject(project: ProjectDTO): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/projects/${project.id}`,
      project
    );
  }

  getOneProject(id: number): Observable<ProjectDTO> {
    return this.http.get<ProjectDTO>(`${environment.apiUrl}/projects/${id}`);
  }

  getProjectQuota(id: number): Observable<ICloudApiProjectQuota> {
    return this.http.get<ICloudApiProjectQuota>(
      `${environment.apiUrl}/projects/${id}/quota`
    );
  }

  getProjectTerraformState(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/projects/${id}/terraform_state`
    );
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/projects/${id}`);
  }
}
