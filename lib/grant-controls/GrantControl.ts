import TokenResponse from "../interfaces/TokenResponse";

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

  /**
   * Generate code challenge from code verifier
   * @param codeVerifier code verifier
   */
  protected generateCodeChallenge(codeVerifier: string) {
    // code here
  }

  async refresh() {}

  async revoke() {}
}
