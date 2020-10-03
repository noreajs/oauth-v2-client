import TokenResponse from "../interfaces/TokenResponse";

export default class GrantControl {
  token?: TokenResponse;

  async refresh() {}

  async revoke() {}
}
