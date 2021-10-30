import { Obj } from "@noreajs/common";
import { parseUrl } from "query-string";
import { refreshToken, requestToken } from "../helpers";
import generateBasicAuthentication from "../helpers/basicAuthFunc";
import {
  generateCodeChallenge,
  generateCodeVerifier,
} from "../helpers/pkceFactory";
import { OauthClientConfig } from "../interfaces";
import AuthorizationCodePKCEGrantOptions from "../interfaces/AuthorizationCodePKCEGrantOptions";
import GetAuthorizationTokenFuncConfig from "../interfaces/GetAuthorizationTokenFuncConfig";
import GetAuthorizationUrlFuncConfig from "../interfaces/GetAuthorizationUrlFuncConfig";
import RefreshTokenFuncConfig from "../interfaces/RefreshTokenFuncConfig";
import TokenRefreshable from "../interfaces/TokenRefreshable";
import GrantControl from "./GrantControl";

export default class AuthorizationCodePKCEGrantControl
  extends GrantControl
  implements TokenRefreshable
{
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
   * @param {GetAuthorizationUrlFuncConfig} options redirect uri, response type
   */
  getAuthUri(options?: GetAuthorizationUrlFuncConfig) {
    // update callback url
    this.redirectUri = options?.callbackUrl ?? this.redirectUri;

    // update local properties
    this.state = options?.state ?? this.state;
    this.options.scopes = options?.scopes ?? this.options.scopes;

    // query params
    const queryParams: any = {
      response_type: options?.responseType ?? "code",
      redirect_uri: this.redirectUri,
      client_id: this.options.clientId,
      state: this.state,
      scope: this.options.scopes ? this.options.scopes.join(" ") : "",
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
   * @param params {GetAuthorizationTokenFuncConfig} parameters
   */
  async getToken<T = any>(params: GetAuthorizationTokenFuncConfig<T>) {
    try {
      // callback url data
      const urlData = parseUrl(params.callbackUrl);

      if (urlData.query.state !== this.state) {
        if (this.log === true || params.log === true) {
          console.log("Corrupted answer, the state doesn't match.", {
            urlData: urlData,
            localState: this.state,
          });
        }
        throw new Error("Corrupted answer, the state doesn't match.");
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
            if (params.onSuccess) params.onSuccess(data, this.state);
          },
          requestOptions: params.requestOptions,
        });
      } else {
        throw urlData.query;
      }
    } catch (error) {
      if (params.onError) {
        params.onError(error);
      } else {
        throw error;
      }
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
      },
      params: params,
      token: this.token,
    });
  }
}
