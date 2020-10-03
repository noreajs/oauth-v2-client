import TokenResponse from "../interfaces/TokenResponse";

export default class GrantControl {
  token?: TokenResponse;

  /**
   * Generate basic authentication header value
   * @param username username
   * @param password password
   */
  generateBasicAuthentication(username: string, password: string) {
    return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  }

  async refresh() {}

  async revoke() {}
}
