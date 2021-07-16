import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { CONSTANT } from '@dinivas/api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class MandatorySelectedProjectGuard implements CanActivate {
  lastProjectId: any;

  constructor(private router: Router, private storage: LocalStorageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (
      next.queryParams['appInitialisation'] ||
      state.url.startsWith('/admin')
    ) {
      return true;
    }
    this.lastProjectId =
      next.queryParams['project'] ||
      this.storage.retrieve(CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY);
    if (!this.lastProjectId) {
      this.router.navigate(['/selectProject'], {
        queryParams: {
          nextState: state.url
        }
      });
      return false;
    }
    if (!next.queryParams['redirected']) {
      this.storage.store(
        CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY,
        this.lastProjectId
      );
      const route: string[] = (state.url.indexOf('?') > -1
        ? state.url.substring(0, state.url.indexOf('?'))
        : state.url
      ).split('/');
      route.shift();
      this.router.navigate(['/'].concat(route), {
        queryParams: {
          project: this.lastProjectId,
          redirected: true
        }
      });
      return false;
    }
    return true;
  }
}
