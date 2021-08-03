import { Observable, Observer } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { FilterType } from './../../core/entity/filter-bar/filter';
import { InstancesService } from './../../shared/compute/instances.service';
import { ConfirmDialogService } from './../../core/dialog/confirm-dialog/confirm-dialog.service';
import { ColumnDef } from './../../core/entity/mat-crud/column-def';
import { MatDialog } from '@angular/material/dialog';
import { MatCrudComponent } from './../../core/entity/mat-crud/mat-crud.component';
import { DataProvider } from './../../core/entity/mat-crud/data-provider';
import { Component } from '@angular/core';
import { ICloudApiInstance, InstanceDTO } from '@dinivas/api-interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'dinivas-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.scss'],
})
export class InstancesComponent
  extends MatCrudComponent
  implements DataProvider<ICloudApiInstance>
{
  filterPlaceholder = 'Filter';
  dataProvider = this;
  instancesList: ICloudApiInstance[] = [];
  columnDefs: Array<ColumnDef>;
  deleteConfirmQuestion = (entity) => `Delete instance ${entity.code} ?`;

  constructor(
    public dialog: MatDialog,
    private readonly instancesService: InstancesService,
    public confirmDialog: ConfirmDialogService,
    private readonly router: Router
  ) {
    super(confirmDialog);
    this.columnDefs = [
      //new ColumnDef('id', 'Id', false),
      new ColumnDef('id', 'Id', true, true, false, FilterType.TEXT),
      new ColumnDef('name', 'Name', false),
      new ColumnDef('status', 'Status', false),
      new ColumnDef('created_date', 'Created date', false),
      new ColumnDef('adresses', 'Adresses', false),
    ];
  }

  getDatas(httpParams: HttpParams): Observable<any> {
    const newFilter = JSON.parse(httpParams.get('filter'));
    const newHttpParams = new HttpParams()
      .set('filter', JSON.stringify(newFilter))
      .set('page', httpParams.get('page'))
      .set('limit', httpParams.get('limit'))
      .set('sort', httpParams.get('sort'));
    return this.instancesService.getInstances(newHttpParams);
  }

  onAddInstance() {
    this.router.navigate(['/compute/instances/new'], {
      queryParamsHandling: 'preserve',
    });
  }

  onDataChanged(instances: any) {
    this.instancesList = instances as ICloudApiInstance[];
  }

  deleteSelected(selection: any[]): Observable<any> {
    return Observable.create((observer: Observer<any>) => {});
  }

  delete(cloudApiInstance: ICloudApiInstance): Observable<any> {
    return this.instancesService.delete(cloudApiInstance.techId);
  }
}
