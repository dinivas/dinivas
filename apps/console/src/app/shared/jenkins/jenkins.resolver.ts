import { JenkinsService } from './jenkins.service';
import { ProjectsService } from '../project/projects.service';
import { Observable } from 'rxjs/';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';
import { JenkinsDTO } from '@dinivas/dto';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class JenkinsResolver implements Resolve<JenkinsDTO[]> {
  constructor(
    private readonly projectService: ProjectsService,
    private readonly jenkinsService: JenkinsService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<JenkinsDTO[]> {
    const projectId = <string>route.queryParams['project'];
    return this.jenkinsService.getJenkins(new HttpParams());
  }
}
