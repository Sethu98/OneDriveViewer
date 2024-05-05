const {ClientCredentials, ResourceOwnerPassword, AuthorizationCode} = require('simple-oauth2');
const {PublicClientApplication} = require("@azure/msal-node");


class AuthHolder {
    accessToken = null;

    setToken(token) {
        this.accessToken = token;
    }

    getToken() {
        return this.accessToken;
    }
}

const abc = {
    client: {
        id: '9639274e-a585-45d1-b2cf-c7549002c817',
        secret: '3ba94526-a025-4b52-8509-fa8d946dc85b'
    }
}

module.exports = {
    AuthHolderInstance: new AuthHolder()
}