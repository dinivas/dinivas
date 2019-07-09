import { CloudproviderDTO, CloudproviderType, CLOUD_TYPES } from '@dinivas/dto';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'dinivas-cloudprovider-dialog',
  templateUrl: './cloudprovider-dialog.component.html',
  styleUrls: ['./cloudprovider-dialog.component.scss']
})
export class CloudproviderDialogComponent implements OnInit {
  cloudproviderForm: FormGroup;
  cloudTypes: CloudproviderType[] = CLOUD_TYPES;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CloudproviderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public cloudprovider: CloudproviderDTO
  ) {}

  ngOnInit() {
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

  cancel() {
    this.dialogRef.close();
  }

  isFormValid(): boolean {
    return this.cloudproviderForm.valid;
  }

  submit(cloudprovider) {
    console.log(cloudprovider);
    this.dialogRef.close(cloudprovider);
  }
}
