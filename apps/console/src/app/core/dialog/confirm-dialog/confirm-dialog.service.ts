import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  constructor(public dialog: MatDialog) {}

  doOnConfirm(question: string, fn: Function | Promise<any> | Observable<any>) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirm-dialog-panel',
      disableClose: true,
      data: { question: question, passedFn: fn }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
}
