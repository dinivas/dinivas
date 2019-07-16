import { CoreModule } from './../../core/core.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { KubernetesRoutingModule } from './kubernetes-routing.module';
import { KubernetesComponent } from './kubernetes.component';
import { CommonUiModule } from '@dinivas/common-ui';

@NgModule({
  declarations: [KubernetesComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    SharedModule,
    CoreModule,
    KubernetesRoutingModule
  ]
})
export class KubernetesModule { }
