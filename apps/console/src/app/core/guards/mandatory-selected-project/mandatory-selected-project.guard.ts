import { Injectable } from '@angular/core';
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
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!next.queryParams['project']) {
      console.log('MandatorySelectedProjectGuard project param does not exist');
      // this.router.navigate([state.url], {
      //   queryParams: {
      //     project: next.queryParams['project']
      //   }
      // });
      return true;
    } else {
      console.log('MandatorySelectedProjectGuard project param exist');
      return true;
    }
  }
}
