import { CommonUiModule } from '@dinivas/common-ui';
import { CoreModule } from './../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketIoModule } from 'ngx-socket-io';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { SharedModule } from '../shared/shared.module';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectWizardComponent } from './project-wizard/project-wizard.component';

@NgModule({
  declarations: [ProjectsComponent, ProjectEditComponent, ProjectWizardComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    ProjectsRoutingModule,
    SocketIoModule
  ],
  entryComponents: [ProjectWizardComponent]
})
export class ProjectsModule { }
