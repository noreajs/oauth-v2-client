import ImplicitGrantOptions from "../interfaces/ImplicitGrantOptions";
import GrantControl from "./GrantControl";
import { parseUrl } from "query-string";

export default class ImplicitGrantControl extends GrantControl {
  private options: ImplicitGrantOptions;
  private state: string;
  private defaultCallback: string;

  constructor(options: ImplicitGrantOptions) {
    super();

    this.options = options;

    // callback url
    this.defaultCallback = this.options.callbackUrl;

    // state generation
    this.state = this.options.state ?? Math.random().toString(36);
  }

  getAuthUri(callbackUrl?: string) {
    // update callback url
    this.defaultCallback = callbackUrl ?? this.defaultCallback;

    // constructing the request
    const url = new URL(this.options.authUrl);
    url.searchParams.set("response_type", "token");
    url.searchParams.set("redirect_uri", this.defaultCallback);
    url.searchParams.set("client_id", this.options.clientId);
    url.searchParams.set("state", this.state);
    url.searchParams.set(
      "scope",
      this.options.scope ? this.options.scope.join(" ") : ""
    );

    return url.toString();
  }

  /**
   * Extract the token within the callback uri
   * @param callbackUri the full callback uri
   */
  getToken<T = any>(callbackUri: string): T {
    // callback url data
    const urlData = parseUrl(callbackUri);

    if (urlData.query.state !== this.state) {
      throw new Error("Corrupted answer, the state doesn't match.");
    } else {
      // delete the state in the answer
      delete urlData.query.state;
    }
    return urlData.query as any;
  }
}
