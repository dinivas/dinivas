import { CloudproviderEditComponent } from './cloudprovider-edit/cloudprovider-edit.component';
import { MandatorySelectedProjectGuard } from './../../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { CloudprovidersComponent } from './cloudproviders.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: CloudprovidersComponent },
  {
    path: 'new',
    component: CloudproviderEditComponent,
    canActivate: [MandatorySelectedProjectGuard]
  },
  {
    path: 'edit/:cloudproviderId',
    component: CloudproviderEditComponent,
    canActivate: [MandatorySelectedProjectGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CloudproviderRoutingModule {}
