import TokenResponse from "../interfaces/TokenResponse";
import { OauthClientConfig, OauthOptions, RequestOptions } from "../interfaces";
import { AxiosRequestConfig } from "axios";
import { Obj } from "@noreajs/common";
import SignFuncConfig from "../interfaces/SignFuncConfig";
import { capitalize } from "../helpers";

export default class GrantControl {
  protected oauthOptions: OauthOptions;
  protected requestOptions: RequestOptions;

  /**
   * Display errors in local data
   * @default `false`
   */
  protected log: boolean = false;

  constructor(config: OauthClientConfig) {
    this.oauthOptions = config.oauthOptions;
    this.requestOptions = config.requestOptions ?? {};
    this.log = config.log ?? false;
  }

  /**
   * Sign axios request config
   * @param options parameters
   */
  sign(options: SignFuncConfig): AxiosRequestConfig {
    // initial config
    let initialConfig: AxiosRequestConfig = {
      baseURL: this.oauthOptions.apiBaseURL,
      headers: {},
    };

    // proxy
    if (options?.proxy) {
      initialConfig.headers["Proxy-Authorization"] = `${capitalize(
        options.token.token_type
      )} ${options.token.access_token}`;
    } else {
      initialConfig.headers["Authorization"] = `${capitalize(
        options.token.token_type
      )} ${options.token.access_token}`;
    }

    // sign function config
    const config = Obj.extend<SignFuncConfig>({
      data: options,
      omits: ["proxy", "token"],
    });

    return Obj.mergeNested({
      left: config,
      right: initialConfig,
      priority: "left",
    });
  }
}
