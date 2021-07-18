import { AuthModule } from './auth/auth.module';
import { CloudproviderService } from './shared/cloudprovider/cloudprovider.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonUiModule } from '@dinivas/common-ui';
import { ApiInfoService } from './api-info.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';
import { FooterComponent } from './layouts/footer/footer.component';
import { NgMathPipesModule } from 'angular-pipes';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonUiModule,
    AuthModule,
    NgMathPipesModule,
    CoreModule,
    EcoFabSpeedDialModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  declarations: [AppComponent, ConfirmationDialogComponent, FooterComponent],
  entryComponents: [ConfirmationDialogComponent],
  providers: [ApiInfoService, CloudproviderService],
  bootstrap: [AppComponent],
})
export class AppModule {}
