import { Obj } from "@noreajs/common";
import Axios from "axios";
import { parseUrl } from "query-string";
import { refreshToken } from "../helpers";
import generateBasicAuthentication from "../helpers/basicAuthFunc";
import injectQueryParams from "../helpers/injectQueryParamsFunc";
import { OauthClientConfig } from "../interfaces";
import AuthorizationCodeGrantOptions from "../interfaces/AuthorizationCodeGrantOptions";
import GetAuthorizationTokenFuncType from "../interfaces/GetAuthorizationTokenFuncType";
import GetAuthorizationUriFuncType from "../interfaces/GetAuthorizationUrlFuncType";
import RefreshTokenFuncType from "../interfaces/RefreshTokenFuncType";
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
      scope: this.options.scope ? this.options.scope.join(" ") : "",
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
   * @param params {GetAuthorizationTokenFuncType} parameters
   */
  async getToken<T = any>(params: GetAuthorizationTokenFuncType<T>) {
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
       * Getting the token
       * --------------------
       */
      await Axios.post(
        injectQueryParams(
          this.options.accessTokenUrl,
          Obj.merge(
            params.requestOptions?.query ?? {},
            this.requestOptions.query ?? {}
          )
        ),
        Obj.merge(requestBody, this.requestOptions.body ?? {}),
        {
          headers: Obj.merge(requestHeaders, this.requestOptions.headers ?? {}),
        }
      )
        .then((response) => {
          // update the token
          this.setToken(response.data);

          // call callback
          if (params.onSuccess) params.onSuccess(response.data);
        })
        .catch((error) => {
          if (params.onError) params.onError(error);
        });
    } else {
      return new Error("The code is missing in the answer.");
    }
  }

  /**
   * Refresh the token
   * @param params parameters
   */
  async refresh<T = any>(params: RefreshTokenFuncType<T>) {
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
