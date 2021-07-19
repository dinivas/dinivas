/* eslint-disable @typescript-eslint/member-ordering */
import { TerraformModuleEntityInfo } from './../../shared/terraform/terraform-module-entity-info';
import { Observable, Observer } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { FilterType } from './../../core/entity/filter-bar/filter';
import { ImagesService } from './../../shared/compute/images.service';
import { ConfirmDialogService } from './../../core/dialog/confirm-dialog/confirm-dialog.service';
import { ColumnDef } from './../../core/entity/mat-crud/column-def';
import { MatCrudComponent } from './../../core/entity/mat-crud/mat-crud.component';
import { DataProvider } from './../../core/entity/mat-crud/data-provider';
import { Component, OnInit } from '@angular/core';
import { ICloudApiImage, ProjectDTO } from '@dinivas/api-interfaces';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dinivas-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent
  extends MatCrudComponent
  implements DataProvider<ICloudApiImage>, OnInit
{
  filterPlaceholder = 'Filter';
  dataProvider = this;
  columnDefs: Array<ColumnDef>;
  deleteConfirmQuestion = (entity: { name: string }) =>
    `Delete image ${entity.name} ?`;

  project: ProjectDTO;

  constructor(
    private readonly imagesService: ImagesService,
    public confirmDialog: ConfirmDialogService,
    private activatedRoute: ActivatedRoute
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
      new ColumnDef('min_disk', 'Min disk', false),
      new ColumnDef('date', 'Date', false),
    ];
  }
  ngOnInit() {
    super.ngOnInit();
    this.activatedRoute.data
      .pipe(map((data) => data.currentProjectInfo))
      .subscribe((projectInfo: TerraformModuleEntityInfo<ProjectDTO>) => {
        this.project = projectInfo.entity;
      });
  }

  getDatas(httpParams: HttpParams): Observable<any> {
    const newFilter = JSON.parse(httpParams.get('filter'));
    const newHttpParams = new HttpParams()
      .set('filter', JSON.stringify(newFilter))
      .set('page', httpParams.get('page'))
      .set('limit', httpParams.get('limit'))
      .set('sort', httpParams.get('sort'));
    return this.imagesService.getImages(
      this.project.cloud_provider.id,
      newHttpParams
    );
  }

  onAddImage() {}

  deleteSelected(selection: any[]): Observable<any> {
    return Observable.create((observer: Observer<any>) => {});
  }

  delete(imageDTO: ICloudApiImage): Observable<any> {
    return this.imagesService.deleteImage(0);
  }

  entityCanEdit = (entity: any) => false;
  entityCanDelete = (entity: any) => entity.tags.indexOf('dinivas') === -1;
}
