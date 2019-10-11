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
import { map, defaultIfEmpty } from 'rxjs/operators';
import { TerraformModuleEntityInfo } from '../terraform/terraform-module-entity-info';

@Injectable({ providedIn: 'root' })
export class CurrentProjectResolver
  implements Resolve<TerraformModuleEntityInfo<ProjectDTO>> {
  constructor(
    private readonly projectService: ProjectsService,
    private storage: LocalStorageService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TerraformModuleEntityInfo<ProjectDTO>> {
    const projectIdString =
      <string>route.paramMap.get('projectId') ||
      this.storage.retrieve(CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY);
    const projectId = Number.parseInt(projectIdString);
    return forkJoin([
      this.projectService.getOneProject(projectId),
      this.projectService.getProjectTerraformState(projectId)
    ]).pipe(
      map(result => {
        return { entity: result[0], entityState: result[1] };
      })
    );
  }
}
