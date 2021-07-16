import { GitlabService } from './gitlab.service';
import { Observable } from 'rxjs/';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';
import { Pagination, GitlabDTO } from '@dinivas/api-interfaces';
import { HttpParams } from '@angular/common/http';

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
export class CurrentGitlabResolver implements Resolve<GitlabDTO> {
  constructor(private readonly gitlabService: GitlabService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<GitlabDTO> {
    const gitlablId = <string>route.params['gitlablId'];
    return this.gitlabService.getOne(Number.parseInt(gitlablId));
  }
}
