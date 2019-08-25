import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@dinivas/material';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: registerCustomMatIcon,
      deps: [MatIconRegistry, DomSanitizer],
      multi: true
    }
  ]
})
export class CommonUiModule {}

export function registerCustomMatIcon(
  matIconRegistry: MatIconRegistry,
  domSanitizer: DomSanitizer
) {
  return () => {
    const customSvgIcons = [
      'rabbitmq',
      'kafka',
      'redis',
      'postgresql',
      'radius',
      'elasticsearch',
      'server',
      'mosquitto',
      'minio',
      'ansible',
      'drone',
      'gitlab',
      'jenkins',
      'jenkins2',
      'ara',
      'graylog',
      'disc',
      'hard_drive',
      'mongodb',
      'kubernetes',
      'openshift',
      'docker',
      'github',
      'bitbucket',
      'server2',
      'key',
      'router',
      'network',
      'subnet',
      'ip',
      'checkmark',
      'cpu',
      'ram'
    ];
    customSvgIcons.forEach(icon =>
      matIconRegistry.addSvgIcon(
        icon,
        domSanitizer.bypassSecurityTrustResourceUrl(
          `../assets/icons/${icon}.svg`
        )
      )
    );
  };
}
