import { CommonUiModule } from '@dinivas/common-ui';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, CommonUiModule, HomeRoutingModule, ChartsModule]
})
export class HomeModule {}
