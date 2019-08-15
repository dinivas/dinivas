// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  keyCloakConfig: {
    realm: 'dinivas',
    'bearer-only': true,
    'auth-server-url': 'http://localhost:8085/auth',
    'ssl-required': 'external',
    resource: 'dinivas-api',
    'verify-token-audience': true,
    credentials: {
      secret: 'fca725fb-050b-4332-b432-f34e7078e71c'
    },
    'confidential-port': 0,
    'policy-enforcer': {}
  },
  keycloakAdmin: { 
    username: 'admin',
    password: 'password',
    
  }
};
