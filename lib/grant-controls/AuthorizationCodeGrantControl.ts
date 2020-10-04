import { Obj } from "@noreajs/common";
import Axios from "axios";
import { parseUrl } from "query-string";
import AuthorizationCodeGrantOptions from "../interfaces/AuthorizationCodeGrantOptions";
import GetAuthorizationTokenFuncType from "../interfaces/GetAuthorizationTokenFuncType";
import GetAuthorizationUriFuncType from "../interfaces/GetAuthorizationUrlFuncType";
import RequestOptions from "../interfaces/RequestOptions";
import GrantControl from "./GrantControl";

export default class AuthorizationCodeGrantControl extends GrantControl {
  private options: AuthorizationCodeGrantOptions;
  private requestOptions: RequestOptions;
  private state: string;
  private redirectUri: string;

  constructor(
    requestOptions: RequestOptions,
    options: AuthorizationCodeGrantOptions
  ) {
    super();

    this.requestOptions = requestOptions;
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
        client_id: this.options.clientId,
      };

      /**
       * Client authentication
       * ----------------------
       */
      if (this.options.clientSecret) {
        if (this.options.basicAuthHeader === false) {
          requestBody["client_secret"] = this.options.clientSecret;
        } else {
          requestHeaders["Authorization"] = this.generateBasicAuthentication(
            this.options.clientId,
            this.options.clientSecret
          );
        }
      }

      /**
       * Getting the token
       * --------------------
       */
      await Axios.post(
        this.options.accessTokenUrl,
        Obj.merge(requestBody, this.requestOptions.body ?? {}),
        {
          headers: Obj.merge(requestHeaders, this.requestOptions.headers ?? {}),
        }
      )
        .then((response) => {
          if (params.onSuccess) params.onSuccess(response.data);
        })
        .catch((error) => {
          if (params.onError) params.onError(error);
        });
    } else {
      return new Error("The code is missing in the answer.");
    }
  }
}
