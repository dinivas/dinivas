import { Component } from '@angular/core';

@Component({
  selector: 'shepherd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sideNavOpened: boolean;

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }
}
