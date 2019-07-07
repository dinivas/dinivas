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

@NgModule({
  declarations: [AppComponent, ConfirmationDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonUiModule,
    AuthModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ],
  providers: [ApiInfoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
