"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AuthorizationCodeGrantControl_1 = __importDefault(require("./grant-controls/AuthorizationCodeGrantControl"));
var ClientCredentialsGrantControl_1 = __importDefault(require("./grant-controls/ClientCredentialsGrantControl"));
var ImplicitGrantControl_1 = __importDefault(require("./grant-controls/ImplicitGrantControl"));
var PasswordGrantControl_1 = __importDefault(require("./grant-controls/PasswordGrantControl"));
var AuthorizationCodePKCEGrantControl_1 = __importDefault(require("./grant-controls/AuthorizationCodePKCEGrantControl"));
var OauthClient = /** @class */ (function () {
    function OauthClient(config) {
        var _a, _b;
        this.config = config;
        // init controls
        /**
         * Implicit grant
         */
        this.implicit = new ImplicitGrantControl_1.default({
            authUrl: this.config.oauthOptions.authUrl,
            basicAuthHeader: this.config.oauthOptions.basicAuthHeader,
            callbackUrl: "" + this.config.oauthOptions.callbackUrl,
            clientId: this.config.oauthOptions.clientId,
            scope: this.config.oauthOptions.scope,
            state: this.config.oauthOptions.state,
        });
        /**
         * Authorization code
         */
        this.authorizationCode = new AuthorizationCodeGrantControl_1.default((_a = this.config.requestOptions) !== null && _a !== void 0 ? _a : {}, {
            accessTokenUrl: "" + this.config.oauthOptions.accessTokenUrl,
            authUrl: this.config.oauthOptions.authUrl,
            callbackUrl: "" + this.config.oauthOptions.callbackUrl,
            clientId: this.config.oauthOptions.clientId,
            basicAuthHeader: this.config.oauthOptions.basicAuthHeader,
            clientSecret: this.config.oauthOptions.clientSecret,
            scope: this.config.oauthOptions.scope,
            state: this.config.oauthOptions.state,
        });
        /**
         * Authorization code with PKCE
         */
        this.authorizationCodePKCE = new AuthorizationCodePKCEGrantControl_1.default({
            accessTokenUrl: "" + this.config.oauthOptions.accessTokenUrl,
            authUrl: this.config.oauthOptions.authUrl,
            callbackUrl: "" + this.config.oauthOptions.callbackUrl,
            clientId: this.config.oauthOptions.clientId,
            codeChallengeMethod: (_b = this.config.oauthOptions.codeChallengeMethod) !== null && _b !== void 0 ? _b : "S256",
            basicAuthHeader: this.config.oauthOptions.basicAuthHeader,
            clientSecret: this.config.oauthOptions.clientSecret,
            codeVerifier: this.config.oauthOptions.codeVerifier,
            scope: this.config.oauthOptions.scope,
            state: this.config.oauthOptions.state,
        });
        /**
         * Password grant
         */
        this.password = new PasswordGrantControl_1.default({
            accessTokenUrl: "" + this.config.oauthOptions.accessTokenUrl,
            username: "" + this.config.oauthOptions.username,
            password: "" + this.config.oauthOptions.password,
            clientId: this.config.oauthOptions.clientId,
            clientSecret: this.config.oauthOptions.clientSecret,
            scope: this.config.oauthOptions.scope,
            basicAuthHeader: this.config.oauthOptions.basicAuthHeader,
        });
        /**
         * Client credentials
         */
        this.client = new ClientCredentialsGrantControl_1.default({
            accessTokenUrl: "" + this.config.oauthOptions.accessTokenUrl,
            clientId: this.config.oauthOptions.clientId,
            clientSecret: this.config.oauthOptions.clientSecret,
            scope: this.config.oauthOptions.scope,
            basicAuthHeader: this.config.oauthOptions.basicAuthHeader,
        });
    }
    return OauthClient;
}());
exports.default = OauthClient;
