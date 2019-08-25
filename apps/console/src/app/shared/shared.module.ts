import { CommonUiModule } from '@dinivas/common-ui';
import { TerraformWebSocket } from './terraform/terraform-websocket.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraformRepresentationComponent } from './terraform/terraform-representation/terraform-representation.component';

@NgModule({
  declarations: [TerraformRepresentationComponent],
  imports: [
    CommonModule,
    CommonUiModule
  ],
  providers: [TerraformWebSocket],
  exports: [TerraformRepresentationComponent]
})
export class SharedModule { }
