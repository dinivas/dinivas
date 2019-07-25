import { environment } from './../../environments/environment';
import * as Keycloakconnect from 'keycloak-connect';
//import * as kcAuthorization from './keycloak-authz';
const KeycloakDefinition = new Keycloakconnect(
  { cookies: true },
  environment.keyCloakConfig
);
KeycloakDefinition['accessDenied'] = function(request, response) {
  response.status(403);
  response.setHeader('X-Dinivas-Auth-Error', 'Access denied to this resource');
  if (request['requiredPermissions']) {
    response.setHeader('X-Dinivas-Auth-Required-Permissions', request['requiredPermissions']);
  }
  response.end('Access denied');
};

export const Keycloak = KeycloakDefinition;
//export const KeycloakAuthorization  = new kcAuthorization(Keycloak);
