import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { FilterType } from './../../core/entity/filter-bar/filter';
import { ColumnDef } from './../../core/entity/mat-crud/column-def';
import { ConfirmDialogService } from './../../core/dialog/confirm-dialog/confirm-dialog.service';
import { DataProvider } from './../../core/entity/mat-crud/data-provider';
import { MatCrudComponent } from './../../core/entity/mat-crud/mat-crud.component';
import { Component, Inject, OnInit } from '@angular/core';
import { TerraformStateDTO } from '@dinivas/api-interfaces';
import { TerraformStateService } from './terraform-state.service';

@Component({
  selector: 'dinivas-terraform-state',
  templateUrl: './terraform-state.component.html',
  styleUrls: ['./terraform-state.component.scss'],
})
export class TerraformStateComponent
  extends MatCrudComponent
  implements DataProvider<TerraformStateDTO>
{
  filterPlaceholder = 'Filter';
  dataProvider = this;
  columnDefs: Array<ColumnDef>;

  constructor(
    public confirmDialog: ConfirmDialogService,
    private terraformStateService: TerraformStateService,
    public dialog: MatDialog
  ) {
    super(confirmDialog);
    this.columnDefs = [
      //new ColumnDef('id', 'Id', true, false, false, FilterType.TEXT),
      new ColumnDef('stateId', 'State Id', true, true, false, FilterType.TEXT),
      new ColumnDef('lockState', '', false),
      new ColumnDef('module', 'Tf module', true, true, false, FilterType.TEXT),
      new ColumnDef('lockId', 'Lock id', false),
      new ColumnDef('lockDate', 'Lock date', false),
    ];
  }

  getDatas(httpParams: HttpParams): Observable<any> {
    return this.terraformStateService.getTerraformState(httpParams);
  }

  showState(tfState: TerraformStateDTO) {
    this.dialog.open(DisplayTerraformStateDialogComponent, {
      data: {
        tfState: tfState,
      },
    });
  }
  unlockState(tfState: TerraformStateDTO) {
    this.terraformStateService
      .forceUnlockTerraformState(tfState.stateId, tfState.module)
      .subscribe((res) => {
        console.log('Unlock done');
      });
  }

  canDeleteTfState(tfState: TerraformStateDTO): boolean {
    return true;
  }

  delete(terraformStateDTO: TerraformStateDTO): Observable<any> {
    return this.terraformStateService.delete(terraformStateDTO.id);
  }
}

@Component({
  templateUrl: './display-terraform-state-dialog.component.html',
  styleUrls: ['./display-terraform-state-dialog.component.scss'],
})
export class DisplayTerraformStateDialogComponent implements OnInit {
  tfState: TerraformStateDTO;
  state: any;
  constructor(
    public dialogRef: MatDialogRef<DisplayTerraformStateDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { tfState: TerraformStateDTO }
  ) {}
  ngOnInit() {
    this.tfState = this.data.tfState;
    this.state = JSON.parse(this.tfState.state);
  }
  close() {
    this.dialogRef.close();
  }
}
