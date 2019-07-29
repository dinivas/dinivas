import { HttpParams } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { CloudproviderService } from './../../shared/cloudprovider/cloudprovider.service';
import { ProjectsService } from './../../shared/project/projects.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { ProjectDTO, CloudproviderDTO } from '@dinivas/dto';

@Component({
  selector: 'dinivas-project-wizard',
  templateUrl: './project-wizard.component.html',
  styleUrls: ['./project-wizard.component.scss']
})
export class ProjectWizardComponent implements OnInit {
  projectForm: FormGroup;
  projectPlanFormGroup: FormGroup;
  cloudproviders: CloudproviderDTO[];
  loggingStack = 'graylog';
  isLinear = true;
  projectPlanSubmited = false;

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectsService,
    private readonly cloudproviderService: CloudproviderService,
    public dialogRef: MatDialogRef<ProjectWizardComponent>,
    @Inject(MAT_DIALOG_DATA) public project: ProjectDTO
  ) {}

  ngOnInit() {
    this.initProjectForm();
    this.projectPlanFormGroup = this.formBuilder.group({});
    this.cloudproviderService
      .getCloudproviders(new HttpParams())
      .subscribe((response: any) => {
        this.cloudproviders = response.items;
      });
  }

  initProjectForm() {
    this.projectForm = this.formBuilder.group({
      name: [this.project ? this.project.name : null, Validators.required],
      code: [this.project ? this.project.code : null, Validators.required],
      cloud_provider: [
        this.project ? this.project.cloud_provider : null,
        Validators.required
      ],
      description: [this.project ? this.project.description : null, null],
      public_router: [this.project ? this.project.description : null, null],
      floating_ip_pool: [this.project ? this.project.name : null, null],
      monitoring: [this.project ? this.project.monitoring : true, null],
      logging: [this.project ? this.project.logging : false, null]
    });
    this.projectForm.controls['cloud_provider'].patchValue(
      this.project ? this.project.cloud_provider : null,
      { onlySelf: true }
    );
    this.projectForm.get('floating_ip_pool').disable();
    this.projectForm.get('public_router').disable();
    this.onChanges();
  }

  isFormValid(): boolean {
    return this.projectForm.valid;
  }

  submit(project: ProjectDTO) {
    project.logging_stack = this.loggingStack;
    if (!this.project) {
      // create
      this.projectService.planProject(project).subscribe(() => {
      });
    } else {
      // update
      project.id = this.project.id;
      this.projectService.updateProject(project).subscribe(() => {
        
      });
    }
  }

  compareFn(
    cloudprovider1: CloudproviderDTO,
    cloudprovider2: CloudproviderDTO
  ) {
    return cloudprovider1 && cloudprovider2
      ? cloudprovider1.id === cloudprovider2.id
      : cloudprovider1 === cloudprovider2;
  }

  onChanges() {
    this.projectForm
      .get('cloud_provider')
      .valueChanges.subscribe(cloudprovider => {
        if (cloudprovider) {
          this.projectForm.get('floating_ip_pool').reset();
          this.projectForm.get('public_router').reset();
          this.projectForm.get('floating_ip_pool').enable();
          this.projectForm.get('public_router').enable();
        } else {
          this.projectForm.get('floating_ip_pool').disable();
          this.projectForm.get('public_router').disable();
        }
      });
  }

  cancel() {
    this.dialogRef.close();
  }
}
