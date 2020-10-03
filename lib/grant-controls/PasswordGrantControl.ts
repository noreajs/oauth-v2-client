import PasswordGrantOptions from "../interfaces/PasswordGrantOptions";
import RequestOptions from "../interfaces/RequestOptions";
import GrantControl from "./GrantControl";

export default class PasswordGrantControl extends GrantControl {
  private options: PasswordGrantOptions;

  constructor(options: PasswordGrantOptions) {
    super();

    this.options = options;
  }

  getToken(requestOptions?: RequestOptions) {
    return "";
  }
}
