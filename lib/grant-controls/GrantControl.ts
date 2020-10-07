import TokenResponse from "../interfaces/TokenResponse";
import { OauthClientConfig, OauthOptions, RequestOptions } from "../interfaces";
import { AxiosRequestConfig } from "axios";
import { Obj } from "@noreajs/common";
import SignFuncConfig from "../interfaces/SignFuncConfig";
import { capitalize } from "../helpers";

export default class GrantControl {
  protected oauthOptions: OauthOptions;
  protected requestOptions: RequestOptions;
  token?: TokenResponse;

  constructor(config: OauthClientConfig) {
    this.oauthOptions = config.oauthOptions;
    this.requestOptions = config.requestOptions ?? {};
  }

  /**
   * Setting the token data
   * @param data token data
   */
  setToken(data: any) {
    this.token = data;
  }

  /**
   * Sign axios request config
   * @param options parameters
   */
  sign(options?: SignFuncConfig): AxiosRequestConfig {
    // Missing token
    if (!this.token) {
      console.error("Oauth V2 Client: Token is missing.");
    }

    // initial config
    let initialConfig: AxiosRequestConfig = {
      baseURL: this.oauthOptions.apiBaseURL,
      headers: {},
    };

    // proxy
    if (options?.proxy) {
      initialConfig.headers["Proxy-Authorization"] = `${capitalize(
        options.token_type ?? this.token?.token_type
      )} ${this.token?.access_token}`;
    } else {
      initialConfig.headers["Authorization"] = `${capitalize(
        options?.token_type ?? this.token?.token_type
      )} ${this.token?.access_token}`;
    }

    // sign function config
    const config = Obj.extend<SignFuncConfig>({
      data: options,
      omits: ["proxy", "token_type"],
    });

    return Obj.mergeNested({
      left: config,
      right: initialConfig,
      priority: "left",
    });
  }
}
