import * as Keycloakconnect from 'keycloak-connect';
import { CONSTANT } from '@dinivas/dto';
import { config } from '../core/config/config.service';
//import * as kcAuthorization from './keycloak-authz';
const KeycloakDefinition = new Keycloakconnect(
  { cookies: true },
  config.get('dinivas.keycloak.config')
);
KeycloakDefinition['accessDenied'] = function(request, response) {
  response.status(403);
  response.setHeader(
    CONSTANT.HTTP_HEADER_AUTH_ERROR,
    'Access denied to this resource'
  );
  if (request['requiredPermissions']) {
    response.setHeader(
      CONSTANT.HTTP_HEADER_AUTH_REQUIRED_PERMISSIONS,
      request['requiredPermissions']
    );
  }
  response.end('Access denied');
};

export const Keycloak = KeycloakDefinition;
//export const KeycloakAuthorization  = new kcAuthorization(Keycloak);
