import { ProviderSourceService } from './../resources/provider-namespaces/provider-source.service';
import { Injectable } from '@angular/core';
import { ProviderSource } from '../resources/provider-namespaces/provider-source';

import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';

@Injectable()
export class ProviderSourceListResolver implements Resolve<ProviderSource[]> {
  constructor(private providerSourceService: ProviderSourceService) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<ProviderSource[]> {
    return this.providerSourceService.query().toPromise();
  }
}
