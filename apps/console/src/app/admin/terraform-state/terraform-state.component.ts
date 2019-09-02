import { Observable } from 'rxjs';
import { HttpParams} from '@angular/common/http';
import { FilterType } from './../../core/entity/filter-bar/filter';
import { ColumnDef } from './../../core/entity/mat-crud/column-def';
import { ConfirmDialogService } from './../../core/dialog/confirm-dialog/confirm-dialog.service';
import { DataProvider } from './../../core/entity/mat-crud/data-provider';
import { MatCrudComponent } from './../../core/entity/mat-crud/mat-crud.component';
import { Component } from '@angular/core';
import { TerraformStateDTO } from '@dinivas/dto';
import { TerraformStateService } from './terraform-state.service';

@Component({
  selector: 'dinivas-terraform-state',
  templateUrl: './terraform-state.component.html',
  styleUrls: ['./terraform-state.component.scss']
})
export class TerraformStateComponent extends MatCrudComponent
  implements DataProvider<TerraformStateDTO> {
  filterPlaceholder = 'Filter';
  dataProvider = this;
  columnDefs: Array<ColumnDef>;

  constructor(
    public confirmDialog: ConfirmDialogService,
    private terraformStateService: TerraformStateService
  ) {
    super(confirmDialog);
    this.columnDefs = [
      new ColumnDef('id', 'Id', true, false, false, FilterType.TEXT),
      new ColumnDef(
        'stateId',
        'State Id',
        true,
        true,
        false,
        FilterType.TEXT
      ),
      new ColumnDef('module', 'Tf module', true, true, false, FilterType.TEXT),
      new ColumnDef('lockId', 'Lock id', false),
      new ColumnDef('lockDate', 'Lock date', false)
    ];
  }

  getDatas(httpParams: HttpParams): Observable<any> {
    return this.terraformStateService.getTerraformState(httpParams);
  }
}
