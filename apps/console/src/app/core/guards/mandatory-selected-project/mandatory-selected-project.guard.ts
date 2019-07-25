import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Injectable, Inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MandatorySelectedProjectGuard implements CanActivate {
  lastProjectId: any;

  constructor(
    private router: Router,
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (next.queryParams['appInitialisation']) {
      return true;
    }
    this.lastProjectId = next.queryParams['project'] || this.lastProjectId;
    if (!this.lastProjectId) {
      this.router.navigate(['/selectProject'], {
        queryParams: {
          nextState: state.url
        }
      });
      return false;
    }
    if (!next.queryParams['redirected']) {
      this.storage.set('dinivas-projectId', this.lastProjectId);
      this.router.navigate([state.url], {
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
