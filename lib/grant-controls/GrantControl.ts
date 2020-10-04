import TokenResponse from "../interfaces/TokenResponse";
import { toASCII } from "punycode";
import { SHA256, SHA1, enc } from "crypto-js";
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
  protected setToken(data: any) {
    this.token = data;
  }
}
