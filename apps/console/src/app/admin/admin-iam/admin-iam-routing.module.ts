import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MembersComponent } from './members/members.component';
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
        component: MembersComponent
      },
      {
        path: 'members/new',
        component: MemberEditComponent
      },
      {
        path: 'members/edit/:memberId',
        component: MemberEditComponent
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
