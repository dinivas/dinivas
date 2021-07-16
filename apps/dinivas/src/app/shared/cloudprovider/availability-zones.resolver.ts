/* eslint-disable @typescript-eslint/no-unused-vars */
import { CloudproviderService } from './cloudprovider.service';
import { ProjectsService } from '../project/projects.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve,
} from '@angular/router';
import {
  CONSTANT,
  ICloudApiAvailabilityZone,
  ProjectDTO,
} from '@dinivas/api-interfaces';
import { LocalStorageService } from 'ngx-webstorage';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AvailabilityZonesResolver
  implements Resolve<ICloudApiAvailabilityZone[]>
{
  constructor(
    private readonly projectService: ProjectsService,
    private readonly cloudProviderService: CloudproviderService,
    private storage: LocalStorageService
  ) {}
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<ICloudApiAvailabilityZone[]> {
    const projectId =
      <string>route.paramMap.get('projectId') ||
      this.storage.retrieve(CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY);
    const currentProject: ProjectDTO = await firstValueFrom(
      this.projectService.getOneProject(projectId)
    );
    return firstValueFrom(
      this.cloudProviderService.getCloudProviderAvailabilityZones(
        currentProject.cloud_provider.id
      )
    );
  }
}
