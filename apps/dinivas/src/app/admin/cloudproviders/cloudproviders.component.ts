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
import {
  CloudproviderDTO,
  ICloudApiImage,
  ICloudApiFlavor,
  ICloudApiNetwork,
  ModuleImageToBuildDTO,
} from '@dinivas/api-interfaces';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImagesService } from '../../shared/compute/images.service';

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
    private readonly router: Router,
    public dialog: MatDialog
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
  onBuildDinivasImage(cloudProvider: CloudproviderDTO) {
    const imageToBuildDialogRef = this.dialog.open(
      ImageToBuildDialogComponent,
      {
        width: '1024px',
        data: {
          cloudProvider: cloudProvider,
        },
      }
    );
    imageToBuildDialogRef.afterClosed().subscribe((res) => console.log(res));
  }
}

@Component({
  templateUrl: './image-to-build-dialog.component.html',
})
export class ImageToBuildDialogComponent implements OnInit {
  cloudImages: ICloudApiImage[];
  cloudFlavors: ICloudApiFlavor[];
  projectNetworks: ICloudApiNetwork[];
  availableModuleImages: string[] = [
    'base_image',
    'proxy',
    'jenkins',
    'rabbitmq',
  ];
  imageToBuildForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ImageToBuildDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { cloudProvider: CloudproviderDTO },
    private formBuilder: FormBuilder,
    private readonly imagesService: ImagesService,
    private readonly cloudproviderService: CloudproviderService
  ) {}
  ngOnInit() {
    const httpParams = new HttpParams().set('loadAll', true);
    const cloudProviderName = this.data.cloudProvider.cloud;
    this.imagesService
      .getImages(this.data.cloudProvider.id, httpParams)
      .subscribe((imgs) => (this.cloudImages = imgs));
    this.cloudproviderService
      .getCloudProviderFlavors(this.data.cloudProvider.id)
      .subscribe((flavors) => (this.cloudFlavors = flavors));
    this.cloudproviderService
      .getCloudProviderNetworks(this.data.cloudProvider.id)
      .subscribe((networks) => (this.projectNetworks = networks));
    this.imageToBuildForm = this.formBuilder.group({
      module_name: [null, Validators.required],
      image_name: [null, Validators.required],
      source_ssh_user: [
        'openstack' == cloudProviderName ? 'centos' : 'root',
        Validators.required,
      ],
      _network: [null, Validators.required],
      floating_ip_network: [null, Validators.required],
      _source_cloud_image: [null, Validators.required],
      _source_cloud_flavor: [null, Validators.required],
      image_tags: [[]],
      override_image_if_exist: [false, null],
    });
  }

  submitImageToBuild(data: any) {
    data.cloudproviderId = this.data.cloudProvider.id;
    data.cloudprovider = this.data.cloudProvider.cloud;
    data.source_cloud_image = data._source_cloud_image.id;
    data.source_cloud_flavor = data._source_cloud_flavor.name;
    data.network = data._network?.id;
    data.availability_zone = data._network.region;
    delete data._network;
    delete data._source_cloud_image;
    delete data._source_cloud_flavor;
    this.imagesService
      .buildImage(data as ModuleImageToBuildDTO)
      .subscribe((res) => {
        this.dialogRef.close(res);
      });
  }

  cancel() {
    this.dialogRef.close();
  }
}
