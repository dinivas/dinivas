import { environment } from './../../environments/environment';
import { KeycloakService } from 'keycloak-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeycloakIdpService {
  constructor(
    private readonly keycloakService: KeycloakService,
    private http: HttpClient
  ) {}

  getIdpToken(provider): Promise<string> {
    return new Promise((resolve, reject) => {
      this.keycloakService.getToken().then(token => {
        return this.http
          .get(
            `${environment.keycloak.url}/realms/${
              environment.keycloak.realm
            }/broker/${provider}/token`,
            { responseType: 'text' }
          )
          .subscribe(token => {
            if (provider === 'github') {
              resolve(
                JSON.parse(
                  '{"' +
                    decodeURI(token)
                      .replace(/"/g, '\\"')
                      .replace(/&/g, '","')
                      .replace(/=/g, '":"') +
                    '"}'
                )
              );
            } else {
              resolve(JSON.parse(token));
            }
          });
      });
    });
  }
}
