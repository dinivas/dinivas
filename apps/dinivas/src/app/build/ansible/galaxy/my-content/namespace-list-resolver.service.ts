import { UserService, IMe } from './../resources/users/user.service';
import { Injectable } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';

import { NamespaceService } from '../resources/namespaces/namespace.service';
import { PagedResponse } from '../resources/paged-response';

@Injectable()
export class NamespaceListResolver implements Resolve<PagedResponse> {
  constructor(
    private namespaceService: NamespaceService,
    private userService: UserService
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<PagedResponse> {
    const me: IMe = await this.userService.me().toPromise();
    //if (this.authService.meCache.staff) {
    // staff can view and update all namespaces
    //    return this.namespaceService.pagedQuery({}).toPromise();
    //}
    return this.namespaceService
      .pagedQuery({
        owners__username: me.username
      })
      .toPromise();
  }
}
