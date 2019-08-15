import { KeycloakService } from 'keycloak-angular';
import { Injectable } from '@angular/core';

import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';
import { NamespaceService } from '../resources/namespaces/namespace.service';
import { PagedResponse } from '../resources/paged-response';

@Injectable()
export class NamespaceListResolver implements Resolve<PagedResponse> {
    constructor(
        private namespaceService: NamespaceService,
        private readonly keycloakService: KeycloakService
        ) {}

    async resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Promise<PagedResponse> {
        let userDetails: Keycloak.KeycloakProfile;
        if (await this.keycloakService.isLoggedIn()) {
            userDetails = await this.keycloakService.loadUserProfile();
          }
        //if (this.authService.meCache.staff) {
            // staff can view and update all namespaces
        //    return this.namespaceService.pagedQuery({}).toPromise();
        //}
        return this.namespaceService.pagedQuery({
            owners__username: userDetails.username,
        }).toPromise();
    }
}
