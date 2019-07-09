import { IServerInfo } from '@dinivas/model';
import { ApiInfoService } from './api-info.service';
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
  sideNavOpened: boolean;
  userDetails: Keycloak.KeycloakProfile;
  currentProject: any;
  serverInfo: IServerInfo;

  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly apiInfoService: ApiInfoService,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.userDetails = await this.keycloakService.loadUserProfile();
      this.apiInfoService
        .getApiServerInfo()
        .subscribe((serverInfo: IServerInfo) => (this.serverInfo = serverInfo));
    }
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
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
