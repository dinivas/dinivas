import { Provider } from './provider';
import { environment } from '../../../../../../environments/environment';
import { AlertService } from '../../../../../core/alert/alert.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RepositorySource } from '../repositories/repository-source';


@Injectable({
    providedIn: 'root'
  })
export class ProviderService {
    private url = `${environment.apiUrl}/ansible-galaxy/api/v1/providers`;

    constructor(
        private http: HttpClient,
        private alertService: AlertService
    ) {}

    queryActive(): Observable<Provider[]> {
        return this.http.get<Provider[]>(this.url + '/active/').pipe(
            tap(providerNamespaces => this.log('fetched providers')),
            catchError(this.handleError('Query', [])),
        );
    }

    getRepoSources(params): Observable<RepositorySource[]> {
        return this.http
            .get<RepositorySource[]>(
                `${this.url}/${params.providerName}/${params.name}/`,
            )
            .pipe(
                tap(providerNamespaces =>
                    this.log('fetched source repositories'),
                ),
                catchError(this.handleError('Query', [])),
            );
    }

    private handleError<T>(operation = '', result?: T) {
        return (error: any): Observable<T> => {
            console.error(`${operation} failed, error:`, error);
            this.log(`${operation} provider source error: ${error.message}`);
            this.alertService.error(`${operation} user failed:`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    private log(message: string) {
        console.log('ProviderSourceService: ' + message);
    }
}
