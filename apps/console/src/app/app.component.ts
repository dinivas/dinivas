import { IServerInfo } from '@dinivas/dto';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { KeycloakService } from 'keycloak-angular';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'dinivas-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sideNavMode = 'side';
  sideNavOpened: boolean;
  userDetails: Keycloak.KeycloakProfile;
  currentProject: any;
  serverInfo: IServerInfo;
  routerLinkActiveOptionsExact: any = { exact: true };

  constructor(
    private readonly keycloakService: KeycloakService,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.userDetails = await this.keycloakService.loadUserProfile();
    }
    if (this.sideNavMode === 'side') this.sideNavOpened = true;
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
}
