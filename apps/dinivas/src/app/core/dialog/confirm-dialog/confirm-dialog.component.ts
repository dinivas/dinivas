import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'dinivas-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  executeFn() {
    if (this.data.passedFn instanceof Function) {
      this.dialogRef.close(this.data.passedFn());
    } else if (this.data.passedFn instanceof Promise) {
      (this.data.passedFn as Promise<any>).then((res) => this.dialogRef.close(res));
    } else if (this.data.passedFn instanceof Observable) {
      (this.data.passedFn as Observable<any>).subscribe((res) => {
        this.dialogRef.close(res);
      })
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
