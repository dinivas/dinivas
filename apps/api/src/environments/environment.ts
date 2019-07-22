// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  keyCloakConfig: {
    realm: 'dinivas',
    'bearer-only': true,
    'auth-server-url': 'http://localhost:8083/auth',
    'ssl-required': 'external',
    resource: 'dinivas-api',
    'verify-token-audience': true,
    credentials: {
      secret: '60de3dca-6c42-42c3-b542-28ca5feb7fc7'
    },
    'confidential-port': 0,
    'policy-enforcer': {}
  },
  keycloakAdmin: { 
    username: 'admin',
    password: 'password',
    
  }
};
