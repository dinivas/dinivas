import { FilterType } from './../../../core/entity/filter-bar/filter';
import { Observable, Observer } from 'rxjs/';
import { HttpParams } from '@angular/common/http';
import { ConfirmDialogService } from './../../../core/dialog/confirm-dialog/confirm-dialog.service';
import { DataProvider } from './../../../core/entity/mat-crud/data-provider';
import { MatCrudComponent } from './../../../core/entity/mat-crud/mat-crud.component';
import { ColumnDef } from './../../../core/entity/mat-crud/column-def';
import { CloudproviderService } from './../../../shared/cloudprovider/cloudprovider.service';
import { CloudproviderDTO } from '@dinivas/dto';
import { CloudproviderDialogComponent } from './../cloudprovider-dialog/cloudprovider-dialog.component';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'dinivas-cloudprovider-list',
  templateUrl: './cloudprovider-list.component.html',
  styleUrls: ['./cloudprovider-list.component.scss']
})
export class CloudproviderListComponent extends MatCrudComponent
  implements DataProvider<CloudproviderDTO> {
  filterPlaceholder = 'Filter';
  dataProvider = this;
  deleteConfirmQuestion: Function = entity =>
    `Delete Cloud provider ${entity.name} (${entity.cloud}) ?`;

  columnDefs: Array<ColumnDef>;

  constructor(
    public dialog: MatDialog,
    private readonly cloudproviderService: CloudproviderService,
    public confirmDialog: ConfirmDialogService
  ) {
    super(confirmDialog);
    this.columnDefs = [
      new ColumnDef('id', 'Id', true, false, false, FilterType.TEXT),
      new ColumnDef('name', 'Name', true, true, false, FilterType.TEXT),
      new ColumnDef(
        'cloud',
        'Cloud type',
        true,
        true,
        false,
        FilterType.ARRAY,
        ['openstack', 'aws', 'gcp', 'azure']
      ),
      new ColumnDef('description', 'Description', false)
    ];
  }

  getDatas(httpParams: HttpParams): Observable<any> {
    const newFilter = JSON.parse(httpParams.get('filter'));
    const newHttpParams = new HttpParams()
      .set('filter', JSON.stringify(newFilter))
      .set('page', httpParams.get('page'))
      .set('limit', httpParams.get('limit'))
      .set('sort', httpParams.get('sort'));
    return this.cloudproviderService.getCloudproviders(newHttpParams);
  }

  addCloudProvider() {
    const addEntityDialogRef = this.dialog.open(CloudproviderDialogComponent, {
      width: '500px'
    });

    addEntityDialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.refreshDatas();
        }
      },
      err => console.log(err)
    );
  }

  deleteSelected(selection: any[]): Observable<any> {
    return Observable.create((observer: Observer<any>) => {});
  }
  delete(cloudproviderDTO: CloudproviderDTO): Observable<any> {
    return this.cloudproviderService.deleteCloudprovider(cloudproviderDTO.id);
  }

  entityCanEdit = (cloudproviderDTO: CloudproviderDTO) => true;

  entityEdit(cloudproviderDTO: CloudproviderDTO) {
    const addEntityDialogRef = this.dialog.open(CloudproviderDialogComponent, {
      width: '500px',
      data: cloudproviderDTO
    });

    addEntityDialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.refreshDatas();
        }
      },
      err => console.log(err)
    );
  }
}
