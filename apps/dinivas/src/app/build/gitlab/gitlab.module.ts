import { GitlabViewComponent } from './gitlab-view.component';
import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GitlabRoutingModule } from './gitlab-routing.module';
import { GitlabComponent } from './gitlab.component';
import { CommonUiModule } from '@dinivas/common-ui';
import { GitlabStatusComponent } from './gitlab-status/gitlab-status.component';
import { GitlabWizardComponent } from './gitlab-wizard/gitlab-wizard.component';

@NgModule({
  declarations: [
    GitlabComponent,
    GitlabStatusComponent,
    GitlabWizardComponent,
    GitlabViewComponent
  ],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    GitlabRoutingModule
  ],
  entryComponents: [GitlabWizardComponent]
})
export class GitlabModule {}
