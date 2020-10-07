import { Obj } from "@noreajs/common";
import { parseUrl } from "query-string";
import { refreshToken, requestToken } from "../helpers";
import generateBasicAuthentication from "../helpers/basicAuthFunc";
import { OauthClientConfig } from "../interfaces";
import AuthorizationCodeGrantOptions from "../interfaces/AuthorizationCodeGrantOptions";
import GetAuthorizationTokenFuncConfig from "../interfaces/GetAuthorizationTokenFuncConfig";
import GetAuthorizationUriFuncType from "../interfaces/GetAuthorizationUrlFuncConfig";
import RefreshTokenFuncConfig from "../interfaces/RefreshTokenFuncConfig";
import TokenRefreshable from "../interfaces/TokenRefreshable";
import GrantControl from "./GrantControl";

export default class AuthorizationCodeGrantControl
  extends GrantControl
  implements TokenRefreshable {
  private options: AuthorizationCodeGrantOptions;
  private state: string;
  private redirectUri: string;

  constructor(
    config: OauthClientConfig,
    options: AuthorizationCodeGrantOptions
  ) {
    super(config);

    this.options = options;

    // callback url
    this.redirectUri = this.options.callbackUrl;

    // state generation
    this.state = this.options.state ?? Math.random().toString(36);
  }

  /**
   * Get authentication url
   * @param {GetAuthorizationUriFuncType} options redirect uri, response type
   */
  getAuthUri(options?: GetAuthorizationUriFuncType) {
    // update callback url
    this.redirectUri = options?.callbackUrl ?? this.redirectUri;

    // query params
    const queryParams: any = {
      response_type: options?.responseType ?? "code",
      redirect_uri: this.redirectUri,
      client_id: this.options.clientId,
      state: this.state,
      scope: this.options.scopes ? this.options.scopes.join(" ") : "",
    };

    // merged params
    const mergedParams = Obj.merge(
      queryParams,
      this.requestOptions.query ?? {}
    );

    // constructing the request
    const url = new URL(this.options.authUrl);

    for (const param in mergedParams) {
      if (Object.prototype.hasOwnProperty.call(mergedParams, param)) {
        const value = mergedParams[param];
        // setting the param
        url.searchParams.set(param, value);
      }
    }

    return url.toString();
  }

  /**
   * Get token with the authorization code extracted in the callback uri
   * @param params {GetAuthorizationTokenFuncConfig} parameters
   */
  async getToken<T = any>(params: GetAuthorizationTokenFuncConfig<T>) {
    // callback url data
    const urlData = parseUrl(params.callbackUrl);

    if (urlData.query.state !== this.state) {
      throw new Error("Corrupted answer, the state doesn't match.");
    } else {
      // delete the state in the answer
      delete urlData.query.state;
    }

    if (urlData.query.code) {
      // headers
      const requestHeaders: any = {};

      // body
      const requestBody: any = {
        grant_type: "authorization_code",
        code: urlData.query.code,
        redirect_uri: this.redirectUri,
        state: this.state,
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
    } else {
      return new Error("The code is missing in the answer.");
    }
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
