import { AdminIAMMemberEditComponent } from './members/member-edit/member-edit.component';
import { AdminIAMMemberComponent } from './members/members.component';
import { AdminIamComponent } from './admin-iam.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AdminIamComponent,
    children: [
      {
        path: 'members',
        component: AdminIAMMemberComponent
      },
      {
        path: 'members/new',
        component: AdminIAMMemberEditComponent
      },
      {
        path: 'members/edit/:memberId',
        component: AdminIAMMemberEditComponent
      },
      { path: '', redirectTo: 'members' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminIamRoutingModule { }
