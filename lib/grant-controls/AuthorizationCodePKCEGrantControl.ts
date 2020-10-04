import { Obj } from "@noreajs/common";
import Axios from "axios";
import { parseUrl } from "query-string";
import AuthorizationCodePKCEGrantOptions from "../interfaces/AuthorizationCodePKCEGrantOptions";
import GetAuthorizationTokenFuncType from "../interfaces/GetAuthorizationTokenFuncType";
import GetAuthorizationUrlFuncType from "../interfaces/GetAuthorizationUrlFuncType";
import RequestOptions from "../interfaces/RequestOptions";
import GrantControl from "./GrantControl";

export default class AuthorizationCodePKCEGrantControl extends GrantControl {
  private options: AuthorizationCodePKCEGrantOptions;
  private requestOptions: RequestOptions;
  private state: string;
  private redirectUri: string;
  private codeVerifier: string;
  private codeChallenge: string;

  constructor(
    requestOptions: RequestOptions,
    options: AuthorizationCodePKCEGrantOptions
  ) {
    super();

    this.requestOptions = requestOptions;
    this.options = options;

    // callback url
    this.redirectUri = this.options.callbackUrl;

    // state generation
    this.state = this.options.state ?? Math.random().toString(36);

    // code verifier
    this.codeVerifier =
      this.options.codeVerifier ?? this.generateCodeVerifier();

    // code challenge
    this.codeChallenge = this.generateCodeChallenge(this.codeVerifier);
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
        requestHeaders["Authorization"] = this.generateBasicAuthentication(
          this.options.clientId,
          this.options.clientSecret ?? ""
        );
      }

      /**
       * Getting the token
       * --------------------
       */
      await Axios.post(
        this.injectQueryParams(
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
      // could be the token data
      return urlData.query;
    }
  }
}
