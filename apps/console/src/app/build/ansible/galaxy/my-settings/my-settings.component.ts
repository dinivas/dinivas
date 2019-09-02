import { KeycloakIdpService } from '../../../../auth/keycloak-idp.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'dinivas-my-settings',
  templateUrl: './my-settings.component.html',
  styleUrls: ['./my-settings.component.scss']
})
export class MySettingsComponent implements OnInit {
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
