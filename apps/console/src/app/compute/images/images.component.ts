import { Observable, Observer } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { FilterType } from './../../core/entity/filter-bar/filter';
import { ImagesService } from './../../shared/compute/images.service';
import { ConfirmDialogService } from './../../core/dialog/confirm-dialog/confirm-dialog.service';
import { ColumnDef } from './../../core/entity/mat-crud/column-def';
import { MatDialog } from '@angular/material';
import { MatCrudComponent } from './../../core/entity/mat-crud/mat-crud.component';
import { DataProvider } from './../../core/entity/mat-crud/data-provider';
import { Component } from '@angular/core';
import { ICloudApiImage } from '@dinivas/dto';

@Component({
  selector: 'dinivas-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent extends MatCrudComponent
  implements DataProvider<ICloudApiImage> {
  filterPlaceholder = 'Filter';
  dataProvider = this;
  deleteConfirmQuestion: Function = entity =>
    `Delete image ${entity.name} ?`;

  columnDefs: Array<ColumnDef>;
  constructor(
    public dialog: MatDialog,
    private readonly imagesService: ImagesService,
    public confirmDialog: ConfirmDialogService
  ) {
    super(confirmDialog);
    this.columnDefs = [
      //new ColumnDef('id', 'Id', true, false, false, FilterType.TEXT),
      new ColumnDef('name', 'Name', true, true, false, FilterType.TEXT),
      new ColumnDef('dinivasImage', '', false, false, false),
      new ColumnDef('status', 'Status', true, true, false, FilterType.TEXT),
      new ColumnDef('owner', 'Owner', false),
      new ColumnDef('visibility', 'Visibility', false),
      new ColumnDef('size', 'Image size', false),
      new ColumnDef('min_disk', 'Min disk', false)
    ];
  }

  getDatas(httpParams: HttpParams): Observable<any> {
    const newFilter = JSON.parse(httpParams.get('filter'));
    const newHttpParams = new HttpParams()
      .set('filter', JSON.stringify(newFilter))
      .set('page', httpParams.get('page'))
      .set('limit', httpParams.get('limit'))
      .set('sort', httpParams.get('sort'));
    return this.imagesService.getImages(newHttpParams);
  }

  addImage() {}

  deleteSelected(selection: any[]): Observable<any> {
    return Observable.create((observer: Observer<any>) => {});
  }

  delete(imageDTO: ICloudApiImage): Observable<any> {
    return this.imagesService.deleteImage(0);
  }
}
