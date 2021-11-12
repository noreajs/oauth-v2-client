import ImplicitGrantOptions from "../interfaces/ImplicitGrantOptions";
import GrantControl from "./GrantControl";
import { parseUrl } from "query-string";
import { Arr, Obj } from "@noreajs/common";
import GetAuthorizationUriFuncType from "../interfaces/GetAuthorizationUrlFuncConfig";
import { OauthClientConfig } from "../interfaces";

export default class ImplicitGrantControl extends GrantControl {
  private options: ImplicitGrantOptions;
  private state: string | string[];
  private redirectUri: string;

  constructor(config: OauthClientConfig, options: ImplicitGrantOptions) {
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

    // create local properties
    const localState = options?.state ?? this.state;
    this.options.scopes = options?.scopes ?? this.options.scopes;

    // query params
    const queryParams: any = {
      response_type: "token",
      redirect_uri: this.redirectUri,
      client_id: this.options.clientId,
      state: localState,
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
   * Extract the token within the callback uri
   * @param callbackUrl the full callback uri
   * @param state state
   */
  getToken<T = any>(callbackUrl: string, state?: string | string[]): T {
    // callback url data
    const urlData = parseUrl(callbackUrl);

    // local state
    let localState = state ?? this.state;

    // force array
    if (localState === null || localState === undefined) {
      localState = [];
    } else if (!Array.isArray(localState)) {
      localState = [localState];
    }

    // state exists
    if (!localState.includes(urlData.query.state as string)) {
      if (this.log === true) {
        console.log("Corrupted answer, the state doesn't match.", {
          urlData: urlData,
          localState: localState,
        });
      }
      throw new Error("Corrupted answer, the state doesn't match.");
    }

    // set the token
    this.setToken(urlData.query);

    return urlData.query as any;
  }
}
