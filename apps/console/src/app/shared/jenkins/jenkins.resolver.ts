import { JenkinsService } from './jenkins.service';
import { ProjectsService } from '../project/projects.service';
import { Observable } from 'rxjs/';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';
import { JenkinsDTO, Pagination } from '@dinivas/dto';
import { HttpParams } from '@angular/common/http';

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
export class CurrentJenkinsResolver implements Resolve<JenkinsDTO> {
  constructor(private readonly jenkinsService: JenkinsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<JenkinsDTO> {
    const jenkinsId = <string>route.params['jenkinsId'];
    return this.jenkinsService.getOne(Number.parseInt(jenkinsId));
  }
}
