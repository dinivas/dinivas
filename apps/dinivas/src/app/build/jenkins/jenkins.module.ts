import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JenkinsRoutingModule } from './jenkins-routing.module';
import { JenkinsComponent } from './jenkins.component';
import { CommonUiModule } from '@dinivas/common-ui';
import { JenkinsWizardComponent } from './jenkins-wizard/jenkins-wizard.component';
import { JenkinsViewComponent } from './jenkins-view.component';
import { JenkinsStatusComponent } from './jenkins-status/jenkins-status.component';

@NgModule({
  declarations: [JenkinsComponent, JenkinsWizardComponent, JenkinsViewComponent, JenkinsStatusComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    JenkinsRoutingModule
  ],
  entryComponents: [JenkinsWizardComponent]
})
export class JenkinsModule { }
