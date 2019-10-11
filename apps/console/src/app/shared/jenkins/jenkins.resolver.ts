import { JenkinsService } from './jenkins.service';
import { ProjectsService } from '../project/projects.service';
import { Observable, forkJoin } from 'rxjs/';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';
import { JenkinsDTO, Pagination } from '@dinivas/dto';
import { HttpParams } from '@angular/common/http';
import { TerraformModuleEntityInfo } from '../terraform/terraform-module-entity-info';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class JenkinsResolver implements Resolve<Pagination<JenkinsDTO>> {
  constructor(private readonly jenkinsService: JenkinsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Pagination<JenkinsDTO>> {
    return this.jenkinsService.get(new HttpParams());
  }
}

@Injectable({ providedIn: 'root' })
export class CurrentJenkinsResolver
  implements Resolve<TerraformModuleEntityInfo<JenkinsDTO>> {
  constructor(private readonly jenkinsService: JenkinsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TerraformModuleEntityInfo<JenkinsDTO>> {
    const jenkinsIdString = <string>route.params['jenkinsId'];
    const jenkinsId = Number.parseInt(jenkinsIdString);
    return forkJoin([
      this.jenkinsService.getOne(jenkinsId),
      this.jenkinsService.getTerraformState(jenkinsId)
    ]).pipe(
      map(result => {
        return { entity: result[0], entityState: result[1] };
      })
    );
  }
}
