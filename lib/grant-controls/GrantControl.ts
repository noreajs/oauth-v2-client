import TokenResponse from "../interfaces/TokenResponse";
import { OauthClientConfig, OauthOptions, RequestOptions } from "../interfaces";

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
}
