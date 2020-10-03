import AuthorizationCodeGrantControl from "./grant-controls/AuthorizationCodeGrantControl";
import ClientCredentialsGrantControl from "./grant-controls/ClientCredentialsGrantControl";
import ImplicitGrantControl from "./grant-controls/ImplicitGrantControl";
import PasswordGrantControl from "./grant-controls/PasswordGrantControl";
import AuthorizationCodePKCEGrantControl from "./grant-controls/AuthorizationCodePKCEGrantControl";
import OauthClientConfig from "./interfaces/OauthClientConfig";

export default class OauthClient {
  private config: OauthClientConfig;

  // controls
  implicit: ImplicitGrantControl;
  authorizationCode: AuthorizationCodeGrantControl;
  authorizationCodePKCE: AuthorizationCodePKCEGrantControl;
  password: PasswordGrantControl;
  client: ClientCredentialsGrantControl;

  constructor(config: OauthClientConfig) {
    this.config = config;

    // init controls

    /**
     * Implicit grant
     */
    this.implicit = new ImplicitGrantControl({
      authUrl: this.config.oauthOptions.authUrl,
      basicAuthHeader: this.config.oauthOptions.basicAuthHeader,
      callbackUrl: `${this.config.oauthOptions.callbackUrl}`,
      clientId: this.config.oauthOptions.clientId,
      scope: this.config.oauthOptions.scope,
      state: this.config.oauthOptions.state,
    });

    /**
     * Authorization code
     */
    this.authorizationCode = new AuthorizationCodeGrantControl({
      accessTokenUrl: `${this.config.oauthOptions.accessTokenUrl}`,
      authUrl: this.config.oauthOptions.authUrl,
      callbackUrl: `${this.config.oauthOptions.callbackUrl}`,
      clientId: this.config.oauthOptions.clientId,
      basicAuthHeader: this.config.oauthOptions.basicAuthHeader,
      clientSecret: this.config.oauthOptions.clientSecret,
      scope: this.config.oauthOptions.scope,
      state: this.config.oauthOptions.state,
    });

    /**
     * Authorization code with PKCE
     */
    this.authorizationCodePKCE = new AuthorizationCodePKCEGrantControl({
      accessTokenUrl: `${this.config.oauthOptions.accessTokenUrl}`,
      authUrl: this.config.oauthOptions.authUrl,
      callbackUrl: `${this.config.oauthOptions.callbackUrl}`,
      clientId: this.config.oauthOptions.clientId,
      codeChallengeMethod:
        this.config.oauthOptions.codeChallengeMethod ?? "S256",
      basicAuthHeader: this.config.oauthOptions.basicAuthHeader,
      clientSecret: this.config.oauthOptions.clientSecret,
      codeVerifier: this.config.oauthOptions.codeVerifier,
      scope: this.config.oauthOptions.scope,
      state: this.config.oauthOptions.state,
    });

    /**
     * Password grant
     */
    this.password = new PasswordGrantControl({
      accessTokenUrl: `${this.config.oauthOptions.accessTokenUrl}`,
      username: `${this.config.oauthOptions.username}`,
      password: `${this.config.oauthOptions.password}`,
      clientId: this.config.oauthOptions.clientId,
      clientSecret: this.config.oauthOptions.clientSecret,
      scope: this.config.oauthOptions.scope,
      basicAuthHeader: this.config.oauthOptions.basicAuthHeader,
    });

    /**
     * Client credentials
     */
    this.client = new ClientCredentialsGrantControl({
      accessTokenUrl: `${this.config.oauthOptions.accessTokenUrl}`,
      clientId: this.config.oauthOptions.clientId,
      clientSecret: this.config.oauthOptions.clientSecret,
      scope: this.config.oauthOptions.scope,
      basicAuthHeader: this.config.oauthOptions.basicAuthHeader,
    });
  }
}
