export const environment = {
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
