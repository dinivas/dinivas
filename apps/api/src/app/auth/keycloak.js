var Keycloak = require('keycloak-connect');
var session = require('express-session');
var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({ store: memoryStore });

module.exports = {
    keycloak
}