import { CommonUiModule } from '@dinivas/common-ui';
import { CoreModule } from './../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { SharedModule } from '../shared/shared.module';
import { ProjectEditComponent } from './project-edit/project-edit.component';

@NgModule({
  declarations: [ProjectsComponent, ProjectEditComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    ProjectsRoutingModule
  ],
  entryComponents: []
})
export class ProjectsModule { }
