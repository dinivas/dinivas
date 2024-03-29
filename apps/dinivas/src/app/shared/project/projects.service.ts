import { Observable, Subject } from 'rxjs';
import {
  ProjectDTO,
  ICloudApiProjectQuota,
  ApplyModuleDTO,
  ICloudApiFlavor,
  ICloudApiImage,
  ProjectDefinitionDTO,
  ICloudApiKeyPair,
} from '@dinivas/api-interfaces';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
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
      params: httpParams,
    });
  }

  getProjectFlavors(id: number): Observable<ICloudApiFlavor[]> {
    return this.http.get<ICloudApiFlavor[]>(
      `${environment.apiUrl}/projects/${id}/flavors`
    );
  }
  getProjectKeyPairs(id: number): Observable<ICloudApiKeyPair[]> {
    return this.http.get<ICloudApiKeyPair[]>(
      `${environment.apiUrl}/projects/${id}/keypairs`
    );
  }

  getProjectImages(id: number): Observable<ICloudApiImage[]> {
    return this.http.get<ICloudApiImage[]>(
      `${environment.apiUrl}/projects/${id}/images`
    );
  }

  getProjectGuacamoleSSHToken(id: number): Observable<{ token: string }> {
    return this.http.get<{ token: string }>(
      `${environment.apiUrl}/projects/${id}/ssh-terminal-token`
    );
  }

  createProject(projectDefinition: ProjectDefinitionDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}/projects`, projectDefinition);
  }

  planProject(
    project: ProjectDefinitionDTO
  ): Observable<{ planJobId: number }> {
    return this.http.post<{ planJobId: number }>(
      `${environment.apiUrl}/projects/plan`,
      project
    );
  }

  applyProjectPlan(
    applyProjectDTO: ApplyModuleDTO<ProjectDefinitionDTO>
  ): Observable<{ applyJobId: number }> {
    return this.http.post<{ applyJobId: number }>(
      `${environment.apiUrl}/projects/apply-plan`,
      applyProjectDTO
    );
  }

  updateProject(projectDefinition: ProjectDefinitionDTO): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/projects/${projectDefinition.project.id}`,
      projectDefinition
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

  deleteProject(id: number): Observable<{ destroyJobId: number }> {
    return this.http.delete<{ destroyJobId: number }>(
      `${environment.apiUrl}/projects/${id}`
    );
  }
}
