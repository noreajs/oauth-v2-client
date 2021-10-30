import OauthOptions from "./OauthOptions";
import RequestOptions from "./RequestOptions";

export default interface OauthClientConfig {
  oauthOptions: OauthOptions;
  requestOptions?: RequestOptions;
  log?: boolean;
}
