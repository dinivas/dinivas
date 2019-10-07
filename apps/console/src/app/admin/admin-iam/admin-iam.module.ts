import { CoreModule } from './../../core/core.module';
import { SharedModule } from './../../shared/shared.module';
import { CommonUiModule } from '@dinivas/common-ui';
import { MembersComponent } from './members/members.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminIamRoutingModule } from './admin-iam-routing.module';
import { AdminIamComponent } from './admin-iam.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';

@NgModule({
  declarations: [AdminIamComponent, MembersComponent, MemberEditComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    AdminIamRoutingModule
  ]
})
export class AdminIamModule {}
