import { ComponentType } from '@angular/cdk/portal';
import { ContextualMenuService } from './core/contextual-menu/contextual-menu.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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
import {
  Component,
  ViewChild,
  Injector,
  ReflectiveInjector
} from '@angular/core';
import { MatDialog, MatSidenav } from '@angular/material';
import {
  Router,
  ActivatedRoute,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel
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
  @ViewChild('contextualSidenav', { static: true })
  contextualSidenav: MatSidenav;
  contextualMenuComponent: ComponentType<any>;
  contextualMenuInjector: Injector;
  loadingPage = false;

  constructor(
    private readonly keycloakService: KeycloakService,
    public dialog: MatDialog,
    private projectService: ProjectsService,
    private router: Router,
    private route: ActivatedRoute,
    private storage: LocalStorageService,
    private contextualMenuService: ContextualMenuService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.contextualMenuInjector = ReflectiveInjector.resolveAndCreate([
      {
        provide: 'contextualSidenav',
        useValue: {
          value: this.contextualSidenav
        }
      }
    ]);
  }

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

    this.watchRouteChanged();
    this.breakpointObserver.observe(Breakpoints.Handset).subscribe(t => {
      if (t.matches) {
        this.sideNavMode = 'over';
      } else {
        this.sideNavMode = 'side';
        this.sideNavOpened = true;
      }
    });
    this.contextualMenuService.contextualComponent$.subscribe(component => {
      console.log('loading component', component);
      this.contextualMenuComponent = component;
      this.contextualSidenav.open();
    });
  }

  watchRouteChanged() {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loadingPage = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel: {
          this.loadingPage = false;
          break;
        }
        case event instanceof NavigationError: {
          this.loadingPage = false;
          break;
        }
        default: {
          break;
        }
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
      this.storage.store(
        CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY,
        this.currentProject.id
      );
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { project: this.currentProject.id },
        queryParamsHandling: 'merge'
      });
    }
  }
}
