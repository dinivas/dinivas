import { ProjectsService } from '../project/projects.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve,
} from '@angular/router';
import { ICloudApiFlavor, CONSTANT } from '@dinivas/api-interfaces';
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
    _state: RouterStateSnapshot
  ): Promise<ICloudApiFlavor[]> {
    const projectId =
      <string>route.paramMap.get('projectId') ||
      this.storage.retrieve(CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY);
    return this.projectService
      .getProjectFlavors(projectId)
      .pipe(
        flatMap((t) => t),
        filter(
          (flavor) =>
            ('openstack' === flavor.cloudprovider &&
              flavor.name.indexOf('dinivas') > -1) ||
            'digitalocean' === flavor.cloudprovider ||
            'aws' === flavor.cloudprovider
        ),
        toArray(),
        map((items) =>
          items.sort((a, b) => {
            return a.vcpus - b.vcpus + (a.ram - b.ram) + (a.disk - b.disk);
          })
        )
      )
      .toPromise();
  }
}
