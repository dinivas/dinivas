import { MatDialog } from '@angular/material/dialog';
import { DataProvider } from './../../core/entity/mat-crud/data-provider';
import { MatCrudComponent } from './../../core/entity/mat-crud/mat-crud.component';
import { ConfirmDialogService } from './../../core/dialog/confirm-dialog/confirm-dialog.service';
import { ColumnDef } from './../../core/entity/mat-crud/column-def';
import { HttpParams } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { Component } from '@angular/core';
import { RabbitMQDTO } from '@dinivas/api-interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { RabbitMQService } from '../../shared/rabbitmq/rabbitmq.service';

@Component({
  selector: 'dinivas-rabbitmq',
  templateUrl: './rabbitmq.component.html',
  styleUrls: ['./rabbitmq.component.scss'],
})
export class RabbitmqComponent
  extends MatCrudComponent
  implements DataProvider<RabbitMQDTO>
{
  filterPlaceholder = 'Filter';
  dataProvider = this;
  rabbitmqList: RabbitMQDTO[] = [];
  columnDefs: Array<ColumnDef>;
  deleteConfirmQuestion = (entity) =>
    `Delete rabbitmq ${entity.code} ? This will also destroy all attached resources.`;

  constructor(
    public dialog: MatDialog,
    private readonly rabbitmqService: RabbitMQService,
    public confirmDialog: ConfirmDialogService,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(confirmDialog);
    activatedRoute.data
      .pipe(map((data) => data.rabbitMQPage.items))
      .subscribe((rabbitmq: RabbitMQDTO[]) => (this.rabbitmqList = rabbitmq));
    this.columnDefs = [
      //new ColumnDef('id', 'Id', false, false, false),
      new ColumnDef('code', 'Code', false),
      new ColumnDef('url', '?', false),
      new ColumnDef(
        'cluster_availability_zone',
        'cluster_availability_zone',
        false
      ),
      new ColumnDef('node_count', 'node_count', false),
    ];
  }

  getDatas(httpParams: HttpParams): Observable<any> {
    const newFilter = JSON.parse(httpParams.get('filter'));
    const newHttpParams = new HttpParams()
      .set('filter', JSON.stringify(newFilter))
      .set('page', httpParams.get('page'))
      .set('limit', httpParams.get('limit'))
      .set('sort', httpParams.get('sort'));
    return this.rabbitmqService.get(newHttpParams);
  }

  dataChanged(rabbitmqs: any) {
    this.rabbitmqList = rabbitmqs as RabbitMQDTO[];
  }

  addRabbitMQCluster() {
    this.router.navigate(['/messaging/rabbitmq/new'], {
      queryParamsHandling: 'preserve',
    });
  }

  deleteSelected(selection: any[]): Observable<any> {
    return Observable.create((observer: Observer<any>) => {});
  }
  delete(rabbitmqDTO: RabbitMQDTO): Observable<any> {
    return this.rabbitmqService.delete(rabbitmqDTO.id);
  }

  entityCanEdit = (rabbitmqDTO: RabbitMQDTO) => true;
  entityCanDelete = (rabbitmqDTO: RabbitMQDTO) => true;

  entityEdit(rabbitmqDTO: RabbitMQDTO) {}
}
