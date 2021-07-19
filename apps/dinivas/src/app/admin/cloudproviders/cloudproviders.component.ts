import { Router } from '@angular/router';
import { AlertService } from '../../core/alert/alert.service';
import { FilterType } from '../../core/entity/filter-bar/filter';
import { Observable, Observer } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ConfirmDialogService } from '../../core/dialog/confirm-dialog/confirm-dialog.service';
import { DataProvider } from '../../core/entity/mat-crud/data-provider';
import { MatCrudComponent } from '../../core/entity/mat-crud/mat-crud.component';
import { ColumnDef } from '../../core/entity/mat-crud/column-def';
import { CloudproviderService } from '../../shared/cloudprovider/cloudprovider.service';
import { CloudproviderDTO } from '@dinivas/api-interfaces';
import { Component } from '@angular/core';

@Component({
  selector: 'dinivas-cloudproviders',
  templateUrl: './cloudproviders.component.html',
  styleUrls: ['./cloudproviders.component.scss'],
})
export class CloudprovidersComponent
  extends MatCrudComponent
  implements DataProvider<CloudproviderDTO>
{
  filterPlaceholder = 'Filter';
  dataProvider = this;
  columnDefs: Array<ColumnDef>;

  deleteConfirmQuestion = (entity) =>
    `Delete Cloud provider ${entity.name} (${entity.cloud}) ?`;

  constructor(
    private readonly cloudproviderService: CloudproviderService,
    public confirmDialog: ConfirmDialogService,
    private alertService: AlertService,
    private readonly router: Router
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
        ['openstack', 'digitalocean', 'aws', 'gcp', 'azure']
      ),
      new ColumnDef('description', 'Description', false),
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

  onAddCloudProvider() {
    this.router.navigate(['/admin/cloudproviders/new'], {
      queryParamsHandling: 'preserve',
    });
  }

  deleteSelected(selection: any[]): Observable<any> {
    return Observable.create((observer: Observer<any>) => {});
  }
  delete(cloudproviderDTO: CloudproviderDTO): Observable<any> {
    return this.cloudproviderService.deleteCloudprovider(cloudproviderDTO.id);
  }

  entityCanEdit = (cloudproviderDTO: CloudproviderDTO) => true;

  entityEdit(cloudproviderDTO: CloudproviderDTO) {}

  checkConnection(cloudproviderDTO: CloudproviderDTO) {
    this.cloudproviderService
      .checkCloudproviderConnection(cloudproviderDTO)
      .subscribe((response) =>
        this.alertService.success(
          `Config validated for user ${response.user_name} and project ${response.project_name}.`
        )
      );
  }
}
