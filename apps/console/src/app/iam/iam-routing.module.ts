import { MandatorySelectedProjectGuard } from './../core/guards/mandatory-selected-project/mandatory-selected-project.guard';
import { MembersComponent } from './members/members.component';
import { IamComponent } from './iam.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: IamComponent,
    children: [
      {
        path: 'members',
        component: MembersComponent,
        canActivate: [MandatorySelectedProjectGuard]
      },
      { path: '', redirectTo: 'members' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IamRoutingModule {}
