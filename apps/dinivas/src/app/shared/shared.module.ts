import { CoreModule } from './../core/core.module';
import { RouterModule } from '@angular/router';
import { TerraformModuleWizardVarsDirective } from './terraform/terraform-module-wizard/terraform-module-wizard-vars.directive';
import { TerraformModuleWizardComponent } from './terraform/terraform-module-wizard/terraform-module-wizard.component';
import { CommonUiModule } from '@dinivas/common-ui';
import { SocketIoModule } from 'ngx-socket-io';
import { TerraformWebSocket } from './terraform/terraform-websocket.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraformRepresentationComponent } from './terraform/terraform-representation/terraform-representation.component';

@NgModule({
  declarations: [
    TerraformRepresentationComponent,
    TerraformModuleWizardComponent,
    TerraformModuleWizardVarsDirective
  ],
  imports: [
    CommonModule,
    CommonUiModule,
    RouterModule,
    CoreModule,
    SocketIoModule
  ],
  providers: [TerraformWebSocket],
  exports: [
    TerraformRepresentationComponent,
    TerraformModuleWizardComponent,
    TerraformModuleWizardVarsDirective
  ]
})
export class SharedModule {}
