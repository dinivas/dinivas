import { TerraformModuleEntityInfo } from './../terraform/terraform-module-entity-info';
import { GitlabService } from './gitlab.service';
import { Observable, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve,
} from '@angular/router';
import { Pagination, GitlabDTO } from '@dinivas/api-interfaces';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GitlabResolver implements Resolve<Pagination<GitlabDTO>> {
  constructor(private readonly gitlabService: GitlabService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Pagination<GitlabDTO>> {
    return this.gitlabService.get(new HttpParams());
  }
}

@Injectable({ providedIn: 'root' })
export class CurrentGitlabResolver
  implements Resolve<TerraformModuleEntityInfo<GitlabDTO>>
{
  constructor(private readonly gitlabService: GitlabService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TerraformModuleEntityInfo<GitlabDTO>> {
    const gitlabIdString = <string>route.params['gitlabId'];
    const gitlabId = Number.parseInt(gitlabIdString);
    return forkJoin([
      this.gitlabService.getOne(gitlabId),
      this.gitlabService.getTerraformState(gitlabId),
    ]).pipe(
      map((result) => {
        return { entity: result[0], entityState: result[1] };
      })
    );
  }
}
