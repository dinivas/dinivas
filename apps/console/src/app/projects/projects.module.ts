import { CommonUiModule } from '@dinivas/common-ui';
import { CoreModule } from './../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketIoModule } from 'ngx-socket-io';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectViewComponent } from './project-view.component';
import { SharedModule } from '../shared/shared.module';
import { ProjectWizardComponent } from './project-wizard/project-wizard.component';
import { ProjectStatusComponent } from './project-status/project-status.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectWizardComponent,
    ProjectStatusComponent,
    ProjectViewComponent
  ],
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
export class ProjectsModule {}
