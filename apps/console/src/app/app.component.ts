import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { KeycloakService } from 'keycloak-angular';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'shepherd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sideNavOpened: boolean;
  userDetails: Keycloak.KeycloakProfile;


  constructor(
    private readonly keycloakService: KeycloakService,
    public dialog: MatDialog) { }

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.userDetails = await this.keycloakService.loadUserProfile();
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
      data: "Do you want to logout from the console?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.keycloakService.logout();
      }
    });

  }
}
