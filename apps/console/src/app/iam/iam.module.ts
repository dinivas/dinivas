import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IamRoutingModule } from './iam-routing.module';
import { IamComponent } from './iam.component';
import { MembersComponent } from './members/members.component';
import { CommonUiModule } from '@dinivas/common-ui';

@NgModule({
  declarations: [IamComponent, MembersComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    IamRoutingModule
  ]
})
export class IamModule { }
