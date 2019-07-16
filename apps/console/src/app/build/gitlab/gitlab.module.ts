import { SharedModule } from './../../shared/shared.module';
import { CoreModule } from './../../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GitlabRoutingModule } from './gitlab-routing.module';
import { GitlabComponent } from './gitlab.component';
import { CommonUiModule } from '@dinivas/common-ui';

@NgModule({
  declarations: [GitlabComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    GitlabRoutingModule
  ]
})
export class GitlabModule { }
