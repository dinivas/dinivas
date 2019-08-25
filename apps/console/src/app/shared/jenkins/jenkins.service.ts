import { Observable } from 'rxjs/';
import { environment } from './../../../environments/environment';
import { JenkinsDTO } from '@dinivas/dto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JenkinsService {
  constructor(private http: HttpClient) {}

  getJenkins(httpParams: HttpParams): Observable<JenkinsDTO[]> {
    return this.http.get<JenkinsDTO[]>(`${environment.apiUrl}/jenkins`, {
      params: httpParams
    });
  }

  getOne(id: number): Observable<JenkinsDTO> {
    return this.http.get<JenkinsDTO>(`${environment.apiUrl}/jenkins/${id}`);
  }

  createJenkins(jenkins: JenkinsDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}/jenkins`, jenkins);
  }

  getJenkinsTerraformState(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/jenkins/${id}/terraform_state`
    );
  }

  updateJenkins(jenkins: JenkinsDTO): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/jenkins/${jenkins.id}`,
      jenkins
    );
  }

  planJenkins(jenkins: JenkinsDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}/jenkins/plan`, jenkins);
  }

  applyJenkinsPlan(applyProjectDTO: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/jenkins/apply-plan`,
      applyProjectDTO
    );
  }

  deleteJenkins(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/jenkins/${id}`);
  }
}
