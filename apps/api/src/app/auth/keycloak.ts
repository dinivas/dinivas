import { environment } from './../../environments/environment';
import * as Keycloakconnect from 'keycloak-connect';
//import * as kcAuthorization from './keycloak-authz';
export const Keycloak = new Keycloakconnect({ cookies: true}, environment.keyCloakConfig);
//export const KeycloakAuthorization  = new kcAuthorization(Keycloak);
