import { TerraformStateComponent } from './terraform-state.component';
import { TerraformStateRoutingModule } from './terraform-state-routing.module';
import { CoreModule } from '../../core/core.module';
import { CommonUiModule } from '@dinivas/common-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [TerraformStateComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    TerraformStateRoutingModule
  ],
  entryComponents: []
})
export class TerraformStateModule {}
