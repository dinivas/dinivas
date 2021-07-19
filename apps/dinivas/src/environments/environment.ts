// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.



export const environment = {
  production: false,
  apiUrl: 'http://localhost:3333/api/v1',
  wsRootUrl: 'http://localhost:3333',
  keycloak: {
    url: 'http://localhost:8085/auth',
    realm: 'dinivas',
    clientId: 'dinivas-console'
  },
  guacamole: {
    wsUrl: 'ws://localhost:3336',
    terminalWidth: 1280,
    terminalHeight: 800,
  }
};

// export const environment = {
//   production: false,
//   apiUrl: 'http://api.dinivas.serveo.net/api/v1',
//   keycloak: {
//     url: 'http://auth.dinivas.serveo.net/auth',
//     realm: 'dinivas',
//     clientId: 'dinivas-console'
//   }
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
