import TokenResponse from "../interfaces/TokenResponse";
import { toASCII } from "punycode";
import { SHA256,SHA1, enc } from "crypto-js";

export default class GrantControl {
  token?: TokenResponse;

  /**
   * Generate basic authentication header value
   * @param username username
   * @param password password
   */
  protected generateBasicAuthentication(username: string, password: string) {
    return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  }

  protected generateCodeVerifier() {
    return enc.Hex.stringify(SHA1(Math.random().toString(36)))
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

  async refresh() {}

  async revoke() {}
}
