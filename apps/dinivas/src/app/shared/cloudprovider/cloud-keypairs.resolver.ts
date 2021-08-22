/* eslint-disable @typescript-eslint/no-unused-vars */
import { ProjectsService } from '../project/projects.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve,
} from '@angular/router';
import {
  CONSTANT,
  ICloudApiKeyPair,
} from '@dinivas/api-interfaces';
import { LocalStorageService } from 'ngx-webstorage';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CloudKeyPairsResolver implements Resolve<ICloudApiKeyPair[]> {
  constructor(
    private readonly projectService: ProjectsService,
    private storage: LocalStorageService
  ) {}
  async resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Promise<ICloudApiKeyPair[]> {
    const projectId =
      <string>route.paramMap.get('projectId') ||
      this.storage.retrieve(CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY);
    return firstValueFrom(this.projectService.getProjectKeyPairs(projectId));
  }
}
