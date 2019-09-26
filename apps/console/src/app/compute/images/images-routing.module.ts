import { CurrentProjectResolver } from './../../shared/project/current-project.resolver';
import { ImagesComponent } from './images.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ImagesComponent,
    resolve: { currentProjectInfo: CurrentProjectResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImagesRoutingModule {}
