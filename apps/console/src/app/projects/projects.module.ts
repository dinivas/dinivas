import { CommonUiModule } from '@dinivas/common-ui';
import { CoreModule } from './../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ProjectsComponent, ProjectDialogComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    ProjectsRoutingModule
  ],
  entryComponents: [ProjectDialogComponent]
})
export class ProjectsModule { }
