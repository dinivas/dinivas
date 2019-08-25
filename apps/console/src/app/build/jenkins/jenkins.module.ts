import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JenkinsRoutingModule } from './jenkins-routing.module';
import { JenkinsComponent } from './jenkins.component';
import { CommonUiModule } from '@dinivas/common-ui';
import { JenkinsWizardComponent } from './jenkins-wizard/jenkins-wizard.component';

@NgModule({
  declarations: [JenkinsComponent, JenkinsWizardComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    JenkinsRoutingModule
  ]
})
export class JenkinsModule { }
