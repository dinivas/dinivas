import { HttpParams } from '@angular/common/http';
import { CloudproviderService } from './../../shared/cloudprovider/cloudprovider.service';
import { ProjectService } from './../../shared/project/project.service';
import { ProjectDTO, CloudproviderDTO } from '@dinivas/dto';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'dinivas-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {
  projectForm: FormGroup;
  cloudproviders: CloudproviderDTO[];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public project: ProjectDTO,
    private projectService: ProjectService,
    private readonly cloudproviderService: CloudproviderService
  ) {}

  ngOnInit() {
    this.cloudproviderService
      .getCloudproviders(new HttpParams())
      .subscribe((response: any) => {
        this.cloudproviders = response.items;
      });
    this.projectForm = this.formBuilder.group({
      name: [this.project ? this.project.name : null, Validators.required],
      code: [this.project ? this.project.code : null, Validators.required],
      cloud_provider: [
        this.project ? this.project.cloud_provider : null,
        Validators.required
      ],
      description: [this.project ? this.project.description : null, null]
    });
    this.projectForm.controls['cloud_provider'].setValue(
      this.project ? this.project.cloud_provider : null,
      { onlySelf: true }
    );
  }

  cancel() {
    this.dialogRef.close();
  }

  isFormValid(): boolean {
    return this.projectForm.valid;
  }

  submit(project) {
    if (!this.project) {
      // create
      this.projectService.createProject(project).subscribe(() => {
        this.dialogRef.close(project);
      });
    } else {
      // update
      project.id = this.project.id;
      this.projectService.updateProject(project).subscribe(() => {
        this.dialogRef.close(project);
      });
    }
  }
  trackByIdFn(index, item) {
    return item.id;
  }
}
