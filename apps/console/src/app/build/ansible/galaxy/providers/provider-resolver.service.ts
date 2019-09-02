import { ProviderService } from './../resources/providers/provider.service';
import { KeycloakService } from 'keycloak-angular';
import { Injectable } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs';
import { Provider } from '../resources/providers/provider';

@Injectable()
export class ProviderListResolver implements Resolve<Provider[]> {
  constructor(
    private providerService: ProviderService,
    private readonly keycloakService: KeycloakService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Provider[]> {
    return this.providerService.queryActive();
  }
}
