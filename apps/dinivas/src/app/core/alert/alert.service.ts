import { Injectable, Component, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Injectable()
export class AlertService {

  userAccount: any = {};

  constructor(
    public snackBar: MatSnackBar
  ) {
  }

  private notifyExternalEvent(event) {
    if (this.userAccount.id !== event.userid) {
      this.success(`${event.userFirstName} ${event.userLastName} ${event.activityOperation.toLowerCase()} ${event.entityType}`);
    }
  }

  success(msg: string) {
    this.snackBar.openFromComponent(SnackAlertSuccessComponent, { data: msg });
  }

  warning(msg: string) {
    this.snackBar.openFromComponent(SnackAlertWarningComponent, { data: msg });
  }

  error(msg: string) {
    this.snackBar.openFromComponent(SnackAlertDangerComponent, { data: msg });
  }
}

@Component({
  selector: 'dinivas-snack-alert-success',
  template: `
    <span class="snack-alert success">{{ data }}</span>
  `,
  styleUrls: ['./snack-alert.scss']
})
export class SnackAlertSuccessComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: string
  ) { }
}

@Component({
  selector: 'dinivas-snack-alert-danger',
  template: `
    <span class="snack-alert danger">{{ data }}</span>
  `,
  styleUrls: ['./snack-alert.scss']
})
export class SnackAlertDangerComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: string
  ) { }
}

@Component({
  selector: 'dinivas-snack-alert-warning',
  styleUrls: ['./snack-alert.scss'],
  template: `
    <span class="snack-alert warning">{{ data }}</span>
  `
})
export class SnackAlertWarningComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: string
  ) { }
}