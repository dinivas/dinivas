import { MandatorySelectedProjectGuard } from './../../../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { HistoryComponent } from './history.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', component: HistoryComponent, canActivate: [MandatorySelectedProjectGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule { }
