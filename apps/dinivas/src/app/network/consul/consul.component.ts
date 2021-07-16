import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FilterType } from './../../core/entity/filter-bar/filter';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogService } from './../../core/dialog/confirm-dialog/confirm-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { ConsulService } from './../../shared/consul/consul.service';
import { ColumnDef } from './../../core/entity/mat-crud/column-def';
import { DataProvider } from './../../core/entity/mat-crud/data-provider';
import { MatCrudComponent } from './../../core/entity/mat-crud/mat-crud.component';
import { ConsulDTO, Pagination } from '@dinivas/api-interfaces';
import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'dinivas-consul',
  templateUrl: './consul.component.html',
  styleUrls: ['./consul.component.scss']
})
export class ConsulComponent extends MatCrudComponent
  implements DataProvider<ConsulDTO> {
  filterPlaceholder = 'Filter';
  dataProvider = this;
  consulList: ConsulDTO[] = [];
  deleteConfirmQuestion: Function = entity =>
    `Delete consul ${
      entity.code
    } ? This will also destroy all attached resources.`;

  columnDefs: Array<ColumnDef>;
  constructor(
    public dialog: MatDialog,
    private readonly consulService: ConsulService,
    public confirmDialog: ConfirmDialogService,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(confirmDialog);
    activatedRoute.data
      .pipe(
        map(
          (data) => data.consulPage.items
        )
      )
      .subscribe((consul: ConsulDTO[]) => (this.consulList = consul));
    this.columnDefs = [
      //new ColumnDef('id', 'Id', false, false, false),
      new ColumnDef('code', 'Code', true, true, false, FilterType.TEXT),
      new ColumnDef('project', 'Project code', false),
      new ColumnDef('managed_by_project', '', false),
      new ColumnDef('domain', 'Domain', false),
      new ColumnDef('datacenter', 'Datacenter', false),
      new ColumnDef('servers', 'Nb servers', false),
      new ColumnDef('clients', 'Nb clients', false)
    ];
  }

  getDatas(httpParams: HttpParams): Observable<any> {
    const newFilter = JSON.parse(httpParams.get('filter'));
    const newHttpParams = new HttpParams()
      .set('filter', JSON.stringify(newFilter))
      .set('page', httpParams.get('page'))
      .set('limit', httpParams.get('limit'))
      .set('sort', httpParams.get('sort'));
    return this.consulService.get(newHttpParams);
  }
  dataChanged(consul: ConsulDTO[]) {
    this.consulList = consul;
  }

  addConsul() {
    this.router.navigate(['/network/consul/new'], {
    queryParamsHandling: 'preserve'
});
  }

  deleteSelected(selection: any[]): Observable<any> {
    return Observable.create((observer: Observer<any>) => {});
  }
  delete(consulDTO: ConsulDTO): Observable<any> {
    return this.consulService.delete(consulDTO.id);
  }

  entityCanEdit = (consulDTO: ConsulDTO) => true;
  entityCanDelete = (consulDTO: ConsulDTO) => true;

  entityEdit(consulDTO: ConsulDTO) {}
}
