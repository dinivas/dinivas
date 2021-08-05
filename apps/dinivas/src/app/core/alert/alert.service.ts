import { Injectable, Component, Inject } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

@Injectable()
export class AlertService {
  userAccount: any = {};
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(public snackBar: MatSnackBar) {}

  private notifyExternalEvent(event) {
    if (this.userAccount.id !== event.userid) {
      this.success(
        `${event.userFirstName} ${
          event.userLastName
        } ${event.activityOperation.toLowerCase()} ${event.entityType}`
      );
    }
  }

  success(msg: string) {
    this.snackBar.openFromComponent(SnackAlertSuccessComponent, {
      data: msg,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  warning(msg: string) {
    this.snackBar.openFromComponent(SnackAlertWarningComponent, {
      data: msg,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  error(msg: string) {
    this.snackBar.openFromComponent(SnackAlertDangerComponent, {
      data: msg,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}

@Component({
  selector: 'dinivas-snack-alert-success',
  template: `
    <span class="snack-alert success">{{
      data | truncate: 300:'...':true
    }}</span>
  `,
  styleUrls: ['./snack-alert.scss'],
})
export class SnackAlertSuccessComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {}
}

@Component({
  selector: 'dinivas-snack-alert-danger',
  template: `
    <span class="snack-alert danger">{{
      data | truncate: 300:'...':true
    }}</span>
  `,
  styleUrls: ['./snack-alert.scss'],
})
export class SnackAlertDangerComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {}
}

@Component({
  selector: 'dinivas-snack-alert-warning',
  styleUrls: ['./snack-alert.scss'],
  template: `
    <span class="snack-alert warning">{{
      data | truncate: 300:'...':true
    }}</span>
  `,
})
export class SnackAlertWarningComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {}
}
