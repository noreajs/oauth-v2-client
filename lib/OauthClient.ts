import AuthorizationCodeGrantControl from "./grant-controls/AuthorizationCodeGrantControl";
import ClientCredentialsGrantControl from "./grant-controls/ClientCredentialsGrantControl";
import ImplicitGrantControl from "./grant-controls/ImplicitGrantControl";
import PasswordGrantControl from "./grant-controls/PasswordGrantControl";
import AuthorizationCodePKCEGrantControl from "./grant-controls/AuthorizationCodePKCEGrantControl";
import OauthClientConfig from "./interfaces/OauthClientConfig";
import JWTGrantControl from "./grant-controls/JWTGrantControl";

export default class OauthClient {
  private config: OauthClientConfig;

  // controls
  implicit: ImplicitGrantControl;
  authorizationCode: AuthorizationCodeGrantControl;
  authorizationCodePKCE: AuthorizationCodePKCEGrantControl;
  password: PasswordGrantControl;
  client: ClientCredentialsGrantControl;
  jwt: JWTGrantControl;

  constructor(config: OauthClientConfig) {
    this.config = config;

    // init controls

    /**
     * Implicit grant
     */
    this.implicit = new ImplicitGrantControl(config, {
      authUrl: this.config.oauthOptions.authUrl,
      basicAuthHeader: this.config.oauthOptions.basicAuthHeader,
      callbackUrl: `${this.config.oauthOptions.callbackUrl}`,
      clientId: this.config.oauthOptions.clientId,
      scopes: this.config.oauthOptions.scopes
    });

    /**
     * Authorization code
     */
    this.authorizationCode = new AuthorizationCodeGrantControl(config, {
      accessTokenUrl: `${this.config.oauthOptions.accessTokenUrl}`,
      authUrl: this.config.oauthOptions.authUrl,
      callbackUrl: `${this.config.oauthOptions.callbackUrl}`,
      clientId: this.config.oauthOptions.clientId,
      basicAuthHeader: this.config.oauthOptions.basicAuthHeader,
      clientSecret: this.config.oauthOptions.clientSecret,
      scopes: this.config.oauthOptions.scopes
    });

    /**
     * Authorization code with PKCE
     */
    this.authorizationCodePKCE = new AuthorizationCodePKCEGrantControl(config, {
      accessTokenUrl: `${this.config.oauthOptions.accessTokenUrl}`,
      authUrl: this.config.oauthOptions.authUrl,
      callbackUrl: `${this.config.oauthOptions.callbackUrl}`,
      clientId: this.config.oauthOptions.clientId,
      codeChallengeMethod:
        this.config.oauthOptions.codeChallengeMethod ?? "S256",
      basicAuthHeader: this.config.oauthOptions.basicAuthHeader,
      clientSecret: this.config.oauthOptions.clientSecret,
      scopes: this.config.oauthOptions.scopes
    });

    /**
     * Password grant
     */
    this.password = new PasswordGrantControl(config, {
      accessTokenUrl: `${this.config.oauthOptions.accessTokenUrl}`,
      username: `${this.config.oauthOptions.username}`,
      password: `${this.config.oauthOptions.password}`,
      clientId: this.config.oauthOptions.clientId,
      clientSecret: this.config.oauthOptions.clientSecret,
      scopes: this.config.oauthOptions.scopes,
      basicAuthHeader: this.config.oauthOptions.basicAuthHeader,
    });

    /**
     * Client credentials
     */
    this.client = new ClientCredentialsGrantControl(config, {
      accessTokenUrl: `${this.config.oauthOptions.accessTokenUrl}`,
      clientId: this.config.oauthOptions.clientId,
      clientSecret: this.config.oauthOptions.clientSecret,
      scopes: this.config.oauthOptions.scopes,
      basicAuthHeader: this.config.oauthOptions.basicAuthHeader,
    });

    /**
     * Jwt token
     */
    this.jwt = new JWTGrantControl(config, {
      accessTokenUrl: `${this.config.oauthOptions.accessTokenUrl}`,
      jwtToken: this.config.oauthOptions.jwtToken,
    });
  }
}
