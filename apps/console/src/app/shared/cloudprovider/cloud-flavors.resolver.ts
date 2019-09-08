import { ProjectsService } from '../project/projects.service';
import { Observable } from 'rxjs/';
import { Injectable } from '@angular/core';
import { CloudproviderService } from './cloudprovider.service';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';
import { ICloudApiFlavor, CONSTANT } from '@dinivas/dto';
import { filter, flatMap, map, toArray } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({ providedIn: 'root' })
export class CloudFlavorsResolver implements Resolve<ICloudApiFlavor[]> {
  constructor(
    private readonly projectService: ProjectsService,
    private storage: LocalStorageService
  ) {}
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<ICloudApiFlavor[]> {
    const projectId =
      <string>route.paramMap.get('projectId') ||
      this.storage.retrieve(CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY);
    return this.projectService
      .getProjectFlavors(projectId)
      .pipe(
        flatMap(t => t),
        filter(flavor => flavor.name.indexOf('dinivas') > -1),
        toArray(),
        map(items =>
          items.sort((a, b) => {
            return a.vcpus - b.vcpus + (a.ram - b.ram) + (a.disk - b.disk);
          })
        )
      )
      .toPromise<ICloudApiFlavor[]>();
  }
}
