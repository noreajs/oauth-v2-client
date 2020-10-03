import ClientCredentialsGrantOptions from "../interfaces/ClientCredentialsGrantOptions";
import RequestOptions from "../interfaces/RequestOptions";
import GrantControl from "./GrantControl";

export default class ClientCredentialsGrantControl extends GrantControl {
  private options: ClientCredentialsGrantOptions;

  constructor(options: ClientCredentialsGrantOptions) {
    super();

    this.options = options;
  }

  getToken(requestOptions?: RequestOptions) {
    return "";
  }
}
