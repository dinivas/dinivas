import { ProjectsService } from '../project/projects.service';
import { Injectable } from '@angular/core';
import { CloudproviderService } from './cloudprovider.service';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';
import { ICloudApiImage, CONSTANT } from '@dinivas/dto';
import { filter, flatMap, toArray } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({ providedIn: 'root' })
export class CloudImagesResolver implements Resolve<ICloudApiImage[]> {
  constructor(
    private readonly projectService: ProjectsService,
    private storage: LocalStorageService
  ) {}
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<ICloudApiImage[]> {
    const projectId =
      <string>route.paramMap.get('projectId') ||
      this.storage.retrieve(CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY);
    return this.projectService
      .getProjectImages(projectId)
      .pipe(
        flatMap(t => t),
        // filter(img => img.tags.indexOf('dinivas') > -1),
        toArray()
      )
      .toPromise<ICloudApiImage[]>();
  }
}
