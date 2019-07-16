import { MandatorySelectedProjectGuard } from './../../../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { GalaxyComponent } from './galaxy.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', component: GalaxyComponent, canActivate: [MandatorySelectedProjectGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GalaxyRoutingModule { }
