import { environment } from './../../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PagedResponse } from '../paged-response';
import { RepositoryImport, RepositoryImportSave } from './repository-import';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RepositoryImportService {
  private url = `${environment.apiUrl}/ansible-galaxy/api/v1/imports`;

  constructor(private http: HttpClient) {}

  query(params): Observable<RepositoryImport[]> {
    return this.http.get<PagedResponse>(this.url, { params: params }).pipe(
      map(response => response.results),
      tap(_ => this.log('fetched repository imports')),
      catchError(this.handleError('Query', []))
    );
  }

  save(params: any): Observable<RepositoryImport> {
    return this.http
      .post<RepositoryImportSave>(`${this.url}/`, params, httpOptions)
      .pipe(
        tap((newImport: RepositoryImportSave) =>
          this.log(`Saved repository import`)
        ),
        map(response => response.results[0]),
        catchError(this.handleError<RepositoryImport>('Save'))
      );
  }

  private handleError<T>(operation = '', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed, error:`, error);
      this.log(`${operation} repository import error: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log('RepositoryImportService: ' + message);
  }
}
