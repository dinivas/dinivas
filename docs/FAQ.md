# FAQ

## Technical knows issues

### Error `Cannot read property 'auth_is_check_sso_complete' of undefined` in __dinivas-api__

The lib `keycloak-connect` does not show well the missmatch issue between `token.content.iss` and `this.realmUrl`.
If the Token ISS differ from Dinivas API realmUrl this could be the root cause. Check file `grant-manager` in keycloak-connect (middleware/auth-utils/grant-manager.js)