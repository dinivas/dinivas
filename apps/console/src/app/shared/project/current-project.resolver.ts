import { ProjectsService } from './projects.service';
import { Observable, forkJoin } from 'rxjs/';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';
import { CONSTANT, ProjectDTO } from '@dinivas/dto';
import { LocalStorageService } from 'ngx-webstorage';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CurrentProjectResolver
  implements Resolve<{ project: ProjectDTO; projectState: any }> {
  constructor(
    private readonly projectService: ProjectsService,
    private storage: LocalStorageService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ project: ProjectDTO; projectState: any }> {
    const projectIdString =
      <string>route.paramMap.get('projectId') ||
      this.storage.retrieve(CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY);
    const projectId = Number.parseInt(projectIdString);
    return forkJoin([
      this.projectService.getOneProject(projectId),
      this.projectService.getProjectTerraformState(projectId)
    ]).pipe(
      map(result => {
        return { project: result[0], projectState: result[1] };
      })
    );
  }
}
