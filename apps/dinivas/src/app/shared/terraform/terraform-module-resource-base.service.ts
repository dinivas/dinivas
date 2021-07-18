import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '@dinivas/api-interfaces';

export class TerraformModuleResourceServiceBase<T> {
  constructor(protected http: HttpClient, protected path: string) {}

  get(httpParams: HttpParams): Observable<Pagination<T>> {
    return this.http.get<Pagination<T>>(`${environment.apiUrl}/${this.path}`, {
      params: httpParams
    });
  }

  getOne(id: number): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/${this.path}/${id}`);
  }

  create(entity: T): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.path}`, entity);
  }

  getTerraformState(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/${this.path}/${id}/terraform_state`
    );
  }

  update(entity: T): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/${this.path}/${(<any>entity).id}`,
      entity
    );
  }

  plan(entity: T): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.path}/plan`, entity);
  }

  applyPlan(applyProjectDTO: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/${this.path}/apply-plan`,
      applyProjectDTO
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/${this.path}/${id}`);
  }
}
