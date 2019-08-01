import { TerraformWebSocket } from './terraform/terraform-websocket.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [TerraformWebSocket]
})
export class SharedModule { }
