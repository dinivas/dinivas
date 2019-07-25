import { CoreModule } from './../core/core.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IamRoutingModule } from './iam-routing.module';
import { IamComponent } from './iam.component';
import { MembersComponent } from './members/members.component';
import { CommonUiModule } from '@dinivas/common-ui';
import { MemberEditComponent } from './members/member-edit/member-edit.component';

@NgModule({
  declarations: [IamComponent, MembersComponent, MemberEditComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    IamRoutingModule
  ]
})
export class IamModule { }
