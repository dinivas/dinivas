import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakIdpService } from 'apps/console/src/app/auth/keycloak-idp.service';

@Component({
  selector: 'dinivas-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  keycloakToken: string;

  providers: any[] = [
    {
      name: 'Github',
      icon: 'github'
    },
    {
      name: 'Gitlab',
      icon: 'gitlab'
    },
    {
      name: 'Bitbucket',
      icon: 'bitbucket'
    }
  ];
  constructor(
    private readonly keycloakIdpService: KeycloakIdpService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {}

  isConnected(provider) {
    return false;
  }

  connect(provider) {
    // this.httpClient
    //   .get(
    //     `http://localhost:8089/accounts/${provider.name.toLowerCase()}/login/?process=connect`
    //   )
    //   .subscribe(resp => console.log(resp));
    this.keycloakIdpService
      .getIdpToken(provider.name.toLowerCase())
      .then(token => console.log(token));

    // window.location.href = `http://localhost:8089/accounts/${provider.name.toLowerCase()}/login/?process=connect&access_token=${
    //   this.keycloakToken
    // }`;
  }
}
