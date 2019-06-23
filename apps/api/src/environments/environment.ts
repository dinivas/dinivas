// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  keyCloakConfig: {
    clientId: 'shepherd-api',
    resource: 'shepherd-api',
    bearerOnly: true,
    serverUrl: 'http://localhost:8083/auth',
    realm: 'shepherd',
    credentials: {
      secret: '1d717ca3-e530-4d1a-9106-d7d08443b91e'
    },
  }
};
