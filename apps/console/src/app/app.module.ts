import { CloudproviderService } from './shared/cloudprovider/cloudprovider.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonUiModule } from '@dinivas/common-ui';
import { ApiInfoService } from './api-info.service';
import { AuthModule } from '@dinivas/auth';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent, ConfirmationDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonUiModule,
    AuthModule,

    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

    CoreModule
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ],
  providers: [ApiInfoService, CloudproviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
