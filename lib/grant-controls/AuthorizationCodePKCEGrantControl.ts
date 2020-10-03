import AuthorizationCodePKCEGrantOptions from "../interfaces/AuthorizationCodePKCEGrantOptions";
import RequestOptions from "../interfaces/RequestOptions";
import GrantControl from "./GrantControl";

export default class AuthorizationCodePKCEGrantControl extends GrantControl {
  private options: AuthorizationCodePKCEGrantOptions;

  constructor(options: AuthorizationCodePKCEGrantOptions) {
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
