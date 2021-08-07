import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgMaterialModule } from '@dinivas/ng-material';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    NgMaterialModule,
    FlexLayoutModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    NgMaterialModule,
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
      'ram',
      'pin',
      'harbor',
      'consul',
      'grafana',
      'prometheus',
      'openstack-horizontal',
      'aws',
      'digitalocean',
      'azure',
      'gcp',
      'openstack'
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
