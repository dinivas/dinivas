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
import { ICloudApiImage, InstanceDTO } from '@dinivas/api-interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'dinivas-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.scss']
})
export class InstancesComponent extends MatCrudComponent
  implements DataProvider<InstanceDTO> {
  filterPlaceholder = 'Filter';
  dataProvider = this;
  instancesList: InstanceDTO[] = [];
  deleteConfirmQuestion: Function = entity =>
    `Delete instance ${entity.code} ?`;

  columnDefs: Array<ColumnDef>;
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
      new ColumnDef('code', 'Code', false),
      new ColumnDef('description', 'Description', false),
      new ColumnDef('project', 'Project', false),
      new ColumnDef('keypair_name', 'Keypair', false),
      new ColumnDef('network', 'Network', false)
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

  addInstance() {
    this.router.navigate(['/compute/instances/new'], {
    queryParamsHandling: 'preserve'
});
  }

  dataChanged(instances: InstanceDTO[]) {
    this.instancesList = instances;
  }

  deleteSelected(selection: any[]): Observable<any> {
    return Observable.create((observer: Observer<any>) => {});
  }

  delete(instanceDTO: InstanceDTO): Observable<any> {
    return this.instancesService.delete(instanceDTO.id);
  }
}
