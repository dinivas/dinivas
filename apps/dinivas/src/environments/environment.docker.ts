export const environment = {
  production: true,
  apiUrl: 'http://dinivas-api:3333/api/v1',
  wsRootUrl: 'http://dinivas-api:3333',
  keycloak: {
    url: 'http://keycloak:8085/auth',
    realm: 'dinivas',
    clientId: 'dinivas-console'
  },
  guacamole: {
    wsUrl: 'ws://dinivas-api:3336',
    terminalWidth: 1280,
    terminalHeight: 800,
  }
};
