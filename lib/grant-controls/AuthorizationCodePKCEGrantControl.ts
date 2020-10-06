import { Obj } from "@noreajs/common";
import Axios from "axios";
import { parseUrl } from "query-string";
import { refreshToken, renderRequestBody } from "../helpers";
import generateBasicAuthentication from "../helpers/basicAuthFunc";
import injectQueryParams from "../helpers/injectQueryParamsFunc";
import {
  generateCodeChallenge,
  generateCodeVerifier,
} from "../helpers/pkceFactory";
import { OauthClientConfig } from "../interfaces";
import AuthorizationCodePKCEGrantOptions from "../interfaces/AuthorizationCodePKCEGrantOptions";
import GetAuthorizationTokenFuncType from "../interfaces/GetAuthorizationTokenFuncType";
import GetAuthorizationUrlFuncType from "../interfaces/GetAuthorizationUrlFuncType";
import RefreshTokenFuncType from "../interfaces/RefreshTokenFuncType";
import TokenRefreshable from "../interfaces/TokenRefreshable";
import GrantControl from "./GrantControl";

export default class AuthorizationCodePKCEGrantControl
  extends GrantControl
  implements TokenRefreshable {
  private options: AuthorizationCodePKCEGrantOptions;
  private state: string;
  private redirectUri: string;
  private codeVerifier: string;
  private codeChallenge: string;

  constructor(
    config: OauthClientConfig,
    options: AuthorizationCodePKCEGrantOptions
  ) {
    super(config);

    this.options = options;

    // callback url
    this.redirectUri = this.options.callbackUrl;

    // state generation
    this.state = this.options.state ?? Math.random().toString(36);

    // code verifier
    this.codeVerifier = this.options.codeVerifier ?? generateCodeVerifier();

    // code challenge
    this.codeChallenge = generateCodeChallenge(this.codeVerifier);
  }

  /**
   * Get authentication url
   * @param {GetAuthorizationUrlFuncType} options redirect uri, response type
   */
  getAuthUri(options?: GetAuthorizationUrlFuncType) {
    // update callback url
    this.redirectUri = options?.callbackUrl ?? this.redirectUri;

    // query params
    const queryParams: any = {
      response_type: options?.responseType ?? "code",
      redirect_uri: this.redirectUri,
      client_id: this.options.clientId,
      state: this.state,
      scope: this.options.scope ? this.options.scope.join(" ") : "",
      code_challenge: this.codeChallenge,
      code_challenge_method: this.options.codeChallengeMethod,
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
        state: this.state,
        redirect_uri: this.redirectUri,
        code_verifier: this.codeVerifier,
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
       * Final payloads
       * ============================
       */
      const headers = Obj.merge(
        requestHeaders,
        Obj.merge(
          params.requestOptions?.headers ?? {},
          this.requestOptions.headers ?? {}
        )
      );

      // query parameters
      const queryParams = Obj.merge(
        params.requestOptions?.query ?? {},
        this.requestOptions.query ?? {}
      );

      //body
      const body = Obj.merge(
        requestBody,
        Obj.merge(
          params.requestOptions?.body ?? {},
          this.requestOptions.body ?? {}
        )
      );

      /**
       * Getting the token
       * --------------------
       */
      await Axios.post(
        injectQueryParams(this.options.accessTokenUrl, queryParams),
        renderRequestBody(
          params.requestOptions?.bodyType ??
            this.requestOptions.bodyType ??
            "json",
          body
        ),
        {
          headers: headers,
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
      // could be the token data
      return urlData.query;
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
