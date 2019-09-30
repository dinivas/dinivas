import { ActivatedRoute, Router } from '@angular/router';
import { CloudproviderService } from './../../../shared/cloudprovider/cloudprovider.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CloudproviderType, CLOUD_TYPES, CloudproviderDTO } from '@dinivas/dto';

@Component({
  selector: 'dinivas-cloudprovider-edit',
  templateUrl: './cloudprovider-edit.component.html',
  styleUrls: ['./cloudprovider-edit.component.scss']
})
export class CloudproviderEditComponent implements OnInit {
  cloudprovider: CloudproviderDTO;
  cloudproviderForm: FormGroup;
  cloudTypes: CloudproviderType[] = CLOUD_TYPES;
  constructor(
    private formBuilder: FormBuilder,
    private cloudproviderService: CloudproviderService,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const cloudproviderId = params['cloudproviderId'];
      if (cloudproviderId) {
        this.cloudproviderService
          .getOneCloudProviderRawValue(cloudproviderId)
          .subscribe(cloudprovider => {
            this.cloudprovider = cloudprovider;
            this.initProjectForm();
          });
      } else {
        this.initProjectForm();
      }
    });
  }

  initProjectForm() {
    this.cloudproviderForm = this.formBuilder.group({
      name: [
        this.cloudprovider ? this.cloudprovider.name : null,
        Validators.required
      ],
      cloud: [
        this.cloudprovider ? this.cloudprovider.cloud : null,
        Validators.required
      ],
      description: [
        this.cloudprovider ? this.cloudprovider.description : null,
        null
      ],
      config: [
        this.cloudprovider ? this.cloudprovider.config : null,
        Validators.required
      ]
    });
  }

  isFormValid(): boolean {
    return this.cloudproviderForm.valid;
  }

  submit(cloudprovider) {
    if (!this.cloudprovider) {
      // create
      this.cloudproviderService
        .createCloudprovider(cloudprovider)
        .subscribe(() => {
          this.router.navigate(['/admin', 'cloudproviders'], {
            preserveQueryParams: true
          });
        });
    } else {
      // update
      cloudprovider.id = this.cloudprovider.id;
      this.cloudproviderService
        .updateCloudprovider(cloudprovider)
        .subscribe(() => {
          this.router.navigate(['/admin', 'cloudproviders'], {
            preserveQueryParams: true
          });
        });
    }
  }
}
