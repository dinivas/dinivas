import { SideMenu } from './side-menu';
import { Observable } from 'rxjs/';
import { ConfirmDialogService } from './core/dialog/confirm-dialog/confirm-dialog.service';
import { ComponentType } from '@angular/cdk/portal';
import { ContextualMenuService } from './core/contextual-menu/contextual-menu.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpParams } from '@angular/common/http';
import { ProjectsService } from './shared/project/projects.service';
import { IServerInfo, ProjectDTO, CONSTANT } from '@dinivas/dto';
import { KeycloakService } from 'keycloak-angular';
import {
  Component,
  ViewChild,
  Injector,
  ReflectiveInjector,
  Renderer2,
  OnInit,
  AfterViewInit
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
import { ThemeService } from './core/services/theme.service';
import { countBy, findIndex } from 'lodash';

class SideNavMenuGroup {
  group: string;
  menus: SideNavMenu[];
}
class SideNavMenu {
  name: string;
  label: string;
  routerLink: string[];
  svgIcon: string;
  icon: string;
  isPinned: boolean;
}

@Component({
  selector: 'dinivas-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  sideNavMode = 'side';
  sideNavOpened: boolean;
  routerLinkActiveOptionsExact: any = { exact: true };
  userDetails: Keycloak.KeycloakProfile;
  currentProject: ProjectDTO;
  serverInfo: IServerInfo;
  projects: ProjectDTO[];
  @ViewChild('contextualSidenav', { static: true })
  contextualSidenav: MatSidenav;
  contextualMenuComponent: ComponentType<any>;
  contextualMenuInjector: Injector;
  loadingPage = false;
  isDarkTheme: Observable<boolean>;
  availableMenuGroups: SideNavMenuGroup[] = SideMenu;
  pinnedMenus: SideNavMenu[] = [];

  constructor(
    private readonly keycloakService: KeycloakService,
    public dialog: MatDialog,
    private projectService: ProjectsService,
    private router: Router,
    private route: ActivatedRoute,
    private storage: LocalStorageService,
    public confirmDialog: ConfirmDialogService,
    private contextualMenuService: ContextualMenuService,
    private breakpointObserver: BreakpointObserver,
    private themeService: ThemeService,
    private renderer: Renderer2
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
    // set stored pinned menus
    const storedExistingPinnedMenu: string[] =
      this.storage.retrieve('pinned-menu-names') || [];
    this.availableMenuGroups.forEach(menuGroup => {
      menuGroup.menus.forEach(m => {
        storedExistingPinnedMenu.forEach(name => {
          if (m.name === name) {
            m.isPinned = true;
            this.pinnedMenus.push(m);
          }
        });
      });
    });

    this.isDarkTheme = this.themeService.isDarkTheme;
    this.isDarkTheme.subscribe(isDark => {
      if (isDark) {
        this.renderer.addClass(document.body, 'dark-theme');
      } else {
        this.renderer.removeClass(document.body, 'dark-theme');
      }
    });

    this.route.queryParams.subscribe(params => {
      this.projectService
        .getProjects(new HttpParams())
        .subscribe((data: any) => {
          this.projects = data.items;
          this.projects
            .filter(p => p.id == params['project'])
            .forEach(p => {
              this.currentProject = p;
              this.projectService.setCurrentSelectedProject(p);
            });
        });
    });
    if (await this.keycloakService.isLoggedIn()) {
      this.userDetails = await this.keycloakService.loadUserProfile();
    }

    this.watchRouteChanged();
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(t => {
        if (t.matches) {
          this.sideNavMode = 'over';
        } else {
          this.sideNavMode = 'side';
          this.sideNavOpened = this.storage.retrieve('side-nav-opened') != null
            ? (this.storage.retrieve('side-nav-opened') === true
              ? true
              : false)
            : true;
        }
      });
    this.contextualMenuService.contextualComponent$.subscribe(component => {
      console.log('loading component', component);
      this.contextualMenuComponent = component;
      this.contextualSidenav.open();
    });
  }

  ngAfterViewInit() {
    if (this.storage.retrieve(CONSTANT.BROWSER_STORAGE_THEME_IS_DARK)) {
      setTimeout(() => {
        this.themeService.setDarkTheme(
          this.storage.retrieve(CONSTANT.BROWSER_STORAGE_THEME_IS_DARK)
        );
      }, 1);
    }
  }
  toggleDarkTheme() {
    const newDarkThemeValue = !this.themeService.lastValue;
    this.themeService.setDarkTheme(newDarkThemeValue);
    this.storage.store(
      CONSTANT.BROWSER_STORAGE_THEME_IS_DARK,
      newDarkThemeValue
    );
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

  toggleSideNav(force?: boolean) {
    if (this.sideNavMode !== 'side' || force) {
      this.sideNavOpened = !this.sideNavOpened;
    } else {
      this.sideNavOpened = true;
    }
    this.storage.store('side-nav-opened', this.sideNavOpened);
  }

  togglePin(sideNavMenu: SideNavMenu) {
    if (
      countBy(this.pinnedMenus, (t: SideNavMenu) => t.name === sideNavMenu.name)
        .true
    ) {
      // already pinned
      // remove from pinned menus
      sideNavMenu.isPinned = false;
      this.pinnedMenus.splice(
        findIndex(
          this.pinnedMenus,
          (m: SideNavMenu) => m.name === sideNavMenu.name
        ),
        1
      );
      const storedExistingPinnedMenu: string[] =
        this.storage.retrieve('pinned-menu-names') || [];
      storedExistingPinnedMenu.splice(
        findIndex(
          this.pinnedMenus,
          (name: string) => name === sideNavMenu.name
        ),
        1
      );
      this.storage.store('pinned-menu-names', storedExistingPinnedMenu);
    } else {
      sideNavMenu.isPinned = true;
      this.pinnedMenus.push(sideNavMenu);
      const storedExistingPinnedMenu: string[] =
        this.storage.retrieve('pinned-menu-names') || [];
      storedExistingPinnedMenu.push(sideNavMenu.name);
      this.storage.store('pinned-menu-names', storedExistingPinnedMenu);
    }
  }
  profileManagement() {
    this.keycloakService.getKeycloakInstance().accountManagement();
  }
  logout() {
    this.confirmDialog.doOnConfirm(
      'Do you want lo logout from the console?',
      () => this.keycloakService.logout()
    );
  }

  switchCurrentProject(project: ProjectDTO) {
    if (
      (!this.currentProject && project) ||
      (project && project.id !== this.currentProject.id)
    ) {
      this.currentProject = project;
      this.storage.store(
        CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY,
        this.currentProject.id
      );
      this.projectService.setCurrentSelectedProject(project);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { project: this.currentProject.id },
        queryParamsHandling: 'merge'
      });
    }
  }
}
