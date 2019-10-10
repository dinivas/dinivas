import { CoreModule } from './../../core/core.module';
import { SharedModule } from './../../shared/shared.module';
import { CommonUiModule } from '@dinivas/common-ui';
import { AdminIAMMemberComponent } from './members/members.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminIamRoutingModule } from './admin-iam-routing.module';
import { AdminIamComponent } from './admin-iam.component';

@NgModule({
  declarations: [AdminIamComponent, AdminIAMMemberComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    AdminIamRoutingModule
  ],
  entryComponents: []
})
export class AdminIamModule {}
