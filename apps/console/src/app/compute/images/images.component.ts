import { TerraformModuleEntityInfo } from './../../shared/terraform/terraform-module-entity-info';
import { CloudproviderService } from './../../shared/cloudprovider/cloudprovider.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ProjectsService } from './../../shared/project/projects.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { FilterType } from './../../core/entity/filter-bar/filter';
import { ImagesService } from './../../shared/compute/images.service';
import { ConfirmDialogService } from './../../core/dialog/confirm-dialog/confirm-dialog.service';
import { ColumnDef } from './../../core/entity/mat-crud/column-def';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatCrudComponent } from './../../core/entity/mat-crud/mat-crud.component';
import { DataProvider } from './../../core/entity/mat-crud/data-provider';
import { Component, OnInit, Inject } from '@angular/core';
import {
  ICloudApiImage,
  ICloudApiFlavor,
  CONSTANT,
  ModuleImageToBuildDTO,
  ICloudApiNetwork,
  ProjectDTO
} from '@dinivas/dto';
import { FilterBarCustomButton } from '../../core/entity/filter-bar/filter-bar.component';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dinivas-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent extends MatCrudComponent
  implements DataProvider<ICloudApiImage>, OnInit {
  filterPlaceholder = 'Filter';
  dataProvider = this;
  deleteConfirmQuestion: Function = entity => `Delete image ${entity.name} ?`;

  columnDefs: Array<ColumnDef>;
  filterBarCustomButtons: FilterBarCustomButton[] = [];
  project: ProjectDTO;

  constructor(
    public dialog: MatDialog,
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
      new ColumnDef('min_disk', 'Min disk', false)
    ];
  }
  ngOnInit() {
    super.ngOnInit();
    this.filterBarCustomButtons.push({
      label: 'Build and publish Dinivas image',
      matIcon: 'build'
    });
    this.activatedRoute.data
      .pipe(
        map(
          (data: {
            currentProjectInfo: TerraformModuleEntityInfo<ProjectDTO>;
          }) => data.currentProjectInfo
        )
      )
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
    return this.imagesService.getImages(newHttpParams);
  }

  addImage() {}

  deleteSelected(selection: any[]): Observable<any> {
    return Observable.create((observer: Observer<any>) => {});
  }

  delete(imageDTO: ICloudApiImage): Observable<any> {
    return this.imagesService.deleteImage(0);
  }
  handleCustomButtonClicked(customButton: FilterBarCustomButton) {
    const imageToBuildDialogRef = this.dialog.open(
      ImageToBuildDialogComponent,
      {
        width: '600px',
        data: {
          project: this.project
        }
      }
    );
  }
}

@Component({
  templateUrl: './image-to-build-dialog.component.html'
})
export class ImageToBuildDialogComponent implements OnInit {
  cloudImages: ICloudApiImage[];
  cloudFlavors: ICloudApiFlavor[];
  projectNetworks: ICloudApiNetwork[];
  availableModuleImages: string[] = ['base_image', 'proxy', 'jenkins', 'rabbitmq'];
  imageToBuildForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ImageToBuildDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { project: ProjectDTO },
    private formBuilder: FormBuilder,
    private readonly imagesService: ImagesService,
    private readonly projectService: ProjectsService,
    private readonly cloudproviderService: CloudproviderService,
    private storage: LocalStorageService
  ) {}
  ngOnInit() {
    this.imagesService
      .getImages(new HttpParams())
      .subscribe(imgs => (this.cloudImages = imgs));
    this.projectService
      .getProjectFlavors(
        this.storage.retrieve(CONSTANT.BROWSER_STORAGE_PROJECT_ID_KEY)
      )
      .subscribe(flavors => (this.cloudFlavors = flavors));
    this.cloudproviderService
      .getCloudProviderNetworks(this.data.project.cloud_provider.id)
      .subscribe(networks => (this.projectNetworks = networks));
    this.imageToBuildForm = this.formBuilder.group({
      module_name: [null, Validators.required],
      image_name: [null, Validators.required],
      source_ssh_user: ['centos', Validators.required],
      network: [null, Validators.required],
      floating_ip_network: [null, Validators.required],
      _source_cloud_image: [null, Validators.required],
      _source_cloud_flavor: [null, Validators.required],
      image_tags: [[]],
      override_image_if_exist: [false, null]
    });
  }

  submitImageToBuild(data: any) {
    data.source_cloud_image = data._source_cloud_image.id;
    data.source_cloud_flavor = data._source_cloud_flavor.name;
    delete data._source_cloud_image;
    delete data._source_cloud_flavor;
    this.imagesService
      .buildImage(data as ModuleImageToBuildDTO)
      .subscribe(res => {
        console.log(res);
      });
  }

  cancel() {
    this.dialogRef.close();
  }
}
