import { refreshToken, requestToken } from "../helpers";
import generateBasicAuthentication from "../helpers/basicAuthFunc";
import { OauthClientConfig } from "../interfaces";
import ClientCredentialsGrantFuncConfig from "../interfaces/ClientCredentialsGrantFuncConfig";
import ClientCredentialsGrantOptions from "../interfaces/ClientCredentialsGrantOptions";
import RefreshTokenFuncConfig from "../interfaces/RefreshTokenFuncConfig";
import TokenRefreshable from "../interfaces/TokenRefreshable";
import GrantControl from "./GrantControl";

export default class ClientCredentialsGrantControl
  extends GrantControl
  implements TokenRefreshable {
  private options: ClientCredentialsGrantOptions;

  constructor(
    config: OauthClientConfig,
    options: ClientCredentialsGrantOptions
  ) {
    super(config);

    this.options = options;
  }

  /**
   * Get Client Credentials Grant Token
   * @param params parameters
   */
  async getToken<T = any>(params: ClientCredentialsGrantFuncConfig<T>) {
    // headers
    const requestHeaders: any = {};

    // body
    const requestBody: any = {
      grant_type: "client",
      scope: this.options.scope ? this.options.scope.join(" ") : "",
    };

    /**
     * Client authentication
     * ----------------------
     */
    if (this.options.basicAuthHeader === false) {
      requestBody["client_id"] = this.options.clientId;
      requestBody["client_secret"] = this.options.clientSecret;
    } else {
      requestHeaders["Authorization"] = generateBasicAuthentication(
        this.options.clientId,
        this.options.clientSecret ?? ""
      );
    }

    /**
     * Request a token
     */
    requestToken<T>({
      accessTokenUrl: this.options.accessTokenUrl,
      body: requestBody,
      config: {
        oauthOptions: this.oauthOptions,
        requestOptions: this.requestOptions,
      },
      headers: requestHeaders,
      onError: params.onError,
      onSuccess: (data) => {
        // this update token
        this.setToken(data);
        // call the parent token
        if (params.onSuccess) params.onSuccess(data);
      },
      requestOptions: params.requestOptions,
    });
  }

  /**
   * Refresh the token
   * @param params parameters
   */
  async refresh<T = any>(params: RefreshTokenFuncConfig<T>) {
    refreshToken<T>({
      accessTokenUrl: this.options.accessTokenUrl,
      config: {
        oauthOptions: this.oauthOptions,
        requestOptions: this.requestOptions,
      },
      onSuccess: (data) => {
        // update the token
        this.setToken(data);
      },
      params: params,
      token: this.token,
    });
  }
}
