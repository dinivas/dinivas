import * as Keycloakconnect from 'keycloak-connect';
import { CONSTANT } from '@dinivas/api-interfaces';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { CONFIG_FILE_PATH } from '../config.configuration';
//import * as kcAuthorization from './keycloak-authz';
const configYAML = yaml.load(readFileSync(CONFIG_FILE_PATH, 'utf8')) as Record<
  string,
  any
>;
const KeycloakDefinition = new Keycloakconnect(
  { cookies: true },
  configYAML.dinivas.keycloak.config
);
KeycloakDefinition['accessDenied'] = function (request, response) {
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
