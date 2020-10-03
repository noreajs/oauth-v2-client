import AuthorizationCodeGrantOptions from "../interfaces/AuthorizationCodeGrantOptions";
import RequestOptions from "../interfaces/RequestOptions";
import GrantControl from "./GrantControl";

export default class AuthorizationCodeGrantControl extends GrantControl {
  private options: AuthorizationCodeGrantOptions;

  constructor(options: AuthorizationCodeGrantOptions) {
    super();

    this.options = options;
  }

  getAuthUri() {
    return this.options.authUrl;
  }

  /**
   * Get token with the authorization code extracted in the callback uri
   * @param callbackUri the full callback uri
   */
  async getToken(callbackUri: string, requestOptions?: RequestOptions) {
    return "";
  }
}
