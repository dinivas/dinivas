import { HttpParams } from '@angular/common/http';
import { ProjectsService } from './shared/project/projects.service';
import {
  IServerInfo,
  ProjectDTO,
  ICloudApiProjectQuotaDetail,
  CONSTANT
} from '@dinivas/dto';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { KeycloakService } from 'keycloak-angular';
import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
  Router,
  ActivatedRoute,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError
} from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'dinivas-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sideNavMode = 'side';
  sideNavOpened: boolean;
  userDetails: Keycloak.KeycloakProfile;
  currentProject: ProjectDTO;
  serverInfo: IServerInfo;
  routerLinkActiveOptionsExact: any = { exact: true };
  projects: ProjectDTO[];
  ramQuota: ICloudApiProjectQuotaDetail;
  coresQuota: ICloudApiProjectQuotaDetail;
  instancesQuota: ICloudApiProjectQuotaDetail;
  floatIpQuota: ICloudApiProjectQuotaDetail;

  constructor(
    private readonly keycloakService: KeycloakService,
    public dialog: MatDialog,
    private projectService: ProjectsService,
    private router: Router,
    private route: ActivatedRoute,
    private storage: LocalStorageService
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.projectService
        .getProjects(new HttpParams())
        .subscribe((data: any) => {
          this.projects = data.items;
          this.projects
            .filter(p => p.id == params['project'])
            .forEach(p => {
              this.currentProject = p;
              this.projectService.getProjectQuota(p.id).subscribe(quota => {
                this.ramQuota = quota.ram;
                this.coresQuota = quota.cores;
                this.instancesQuota = quota.instances;
                this.floatIpQuota = quota.floating_ips;
              });
            });
        });
    });
    if (await this.keycloakService.isLoggedIn()) {
      this.userDetails = await this.keycloakService.loadUserProfile();
    }
    if (this.sideNavMode === 'side') this.sideNavOpened = true;

    this.watchRouteChanged();
  }

  watchRouteChanged() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        console.log(event.error);
      }
    });
  }

  toggleSideNav(force: boolean) {
    if (this.sideNavMode != 'side' || force) {
      this.sideNavOpened = !this.sideNavOpened;
    } else {
      this.sideNavOpened = true;
    }
  }

  profileManagement() {
    this.keycloakService.getKeycloakInstance().accountManagement();
  }
  logout() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Do you want to logout from the console?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.keycloakService.logout();
      }
    });
  }

  switchCurrentProject(project: ProjectDTO) {
    if (
      (!this.currentProject && project) ||
      (project && project.id != this.currentProject.id)
    ) {
      this.currentProject = project;
      this.storage.store(CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY, this.currentProject.id);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { project: this.currentProject.id },
        queryParamsHandling: 'merge'
      });
    }
  }
}
