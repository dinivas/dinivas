import { ProjectsService } from './projects.service';
import { Observable } from 'rxjs/';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';
import { ICloudApiFlavor, CONSTANT, ProjectDTO } from '@dinivas/dto';
import { filter, flatMap, map, toArray } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({ providedIn: 'root' })
export class CurrentProjectResolver implements Resolve<ProjectDTO> {
  constructor(
    private readonly projectService: ProjectsService,
    private storage: LocalStorageService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ProjectDTO> {
    const projectId =
      <string>route.paramMap.get('projectId') ||
      this.storage.retrieve(CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY);
    return this.projectService.getOneProject(Number.parseInt(projectId));
  }
}
