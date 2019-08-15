import { MandatorySelectedProjectGuard } from './../../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'galaxy',
    loadChildren: './galaxy/galaxy.module#GalaxyModule'
  },
  {
    path: 'history',
    loadChildren: './history/history.module#HistoryModule',
    canActivate: [MandatorySelectedProjectGuard]
  },
  { path: '', redirectTo: 'galaxy', pathMatch: 'prefix' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnsibleRoutingModule {}
