import { Obj } from "@noreajs/common";
import { parseUrl } from "query-string";
import { refreshToken, requestToken } from "../helpers";
import generateBasicAuthentication from "../helpers/basicAuthFunc";
import { OauthClientConfig } from "../interfaces";
import JWTGrantOptions from "../interfaces/JWTGrantOptions";
import GetAuthorizationTokenFuncConfig from "../interfaces/GetAuthorizationTokenFuncConfig";
import GetAuthorizationUriFuncType from "../interfaces/GetAuthorizationUrlFuncConfig";
import JWTGrantTokenFuncConfig from "../interfaces/JWTGrantTokenFuncConfig";
import RefreshTokenFuncConfig from "../interfaces/RefreshTokenFuncConfig";
import TokenRefreshable from "../interfaces/TokenRefreshable";
import GrantControl from "./GrantControl";

export default class JWTGrantControl
  extends GrantControl
  implements TokenRefreshable {
  private options: JWTGrantOptions;

  constructor(
    config: OauthClientConfig,
    options: JWTGrantOptions
  ) {
    super(config);

    this.options = options;
  }

  /**
   * Get token with the authorization code extracted in the callback uri
   * @param params {GetAuthorizationTokenFuncConfig} parameters
   */
  async getToken<T = any>(params: JWTGrantTokenFuncConfig<T>) {
    // headers
    const requestHeaders: any = {};

    // body
    const requestBody: any = {
      grant_type: params.grant_type
    };

    /**
     * Client authentication
     * ----------------------
     */
    requestHeaders["Authorization"] = `JWT ${
      params.jwt_token ?? this.options.jwtToken
    }`;

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
        // this update token
        this.setToken(data);
        // call the parent token
        if (params.onSuccess) params.onSuccess(data);
      },
      params: params,
      token: this.token,
    });
  }
}
