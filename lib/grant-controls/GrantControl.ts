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
   * Generate basic authentication header value
   * @param username username
   * @param password password
   */
  protected generateBasicAuthentication(username: string, password: string) {
    return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  }

  /**
   * Generate code verifier for PKCE implementation
   */
  protected generateCodeVerifier() {
    return enc.Hex.stringify(SHA1(Math.random().toString(36)));
  }

  /**
   * Generate code challenge from code verifier
   * @param codeVerifier code verifier
   */
  protected generateCodeChallenge(codeVerifier: string) {
    return enc.Base64.stringify(SHA256(toASCII(codeVerifier)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  /**
   * Add url's query params
   * @param url URL
   * @param params inject query params in the given URL
   */
  protected injectQueryParams(url: string, params: any) {
    // constructing the request
    const urlObj = new URL(url);

    for (const key in params ?? {}) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = params[key];
        // setting the param
        urlObj.searchParams.set(key, value);
      }
    }

    return urlObj.toString();
  }

  /**
   * Setting the token data
   * @param data token data
   */
  protected setToken(data: any) {
    this.token = data;
  }

  async revoke() {}
}
