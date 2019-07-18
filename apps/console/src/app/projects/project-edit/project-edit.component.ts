import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { ProjectsService } from './../../shared/project/projects.service';
import { CloudproviderService } from './../../shared/cloudprovider/cloudprovider.service';
import { CloudproviderDTO, ProjectDTO } from '@dinivas/dto';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'dinivas-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {
  project: ProjectDTO;
  projectForm: FormGroup;
  cloudproviders: CloudproviderDTO[];

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectsService,
    private readonly cloudproviderService: CloudproviderService,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const projectId = params['projectId'];
      if (projectId) {
        this.projectService.getOneProject(projectId).subscribe(project => {
          this.project = project;
          this.initProjectForm();
        });
      } else {
        this.initProjectForm();
      }
    });
    this.cloudproviderService
      .getCloudproviders(new HttpParams())
      .subscribe((response: any) => {
        this.cloudproviders = response.items;
      });
  }

  isFormValid(): boolean {
    return this.projectForm.valid;
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
      floating_ip_pool: [this.project ? this.project.name : null, null]
    });
    this.projectForm.controls['cloud_provider'].patchValue(
      this.project ? this.project.cloud_provider : null,
      { onlySelf: true }
    );
    this.projectForm.get('floating_ip_pool').disable();
    this.projectForm.get('public_router').disable();
    this.onChanges();
  }

  submit(project) {
    if (!this.project) {
      // create
      this.projectService.createProject(project).subscribe(() => {
        this.router.navigate(['/projects'], { preserveQueryParams: true });
      });
    } else {
      // update
      project.id = this.project.id;
      this.projectService.updateProject(project).subscribe(() => {
        this.router.navigate(['/projects'], { preserveQueryParams: true });
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
}
