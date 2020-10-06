import { OauthClientConfig, TokenResponse } from "../interfaces";
import RevokeTokenFuncType from "../interfaces/RevokeTokenFuncType";
import TokenRequestType from "../interfaces/TokenRequestType";
import generateBasicAuthentication from "./basicAuthFunc";
import requestToken from "./requestTokenFunc";

/**
 * Revoke a token
 * @param props function property
 */
export default async function revokeToken<T = any>(props: TokenRequestType<T> & {
  params: RevokeTokenFuncType<T>;
  accessTokenUrl: string;
  token?: TokenResponse;
  config: OauthClientConfig;
}) {
  /**
   * Only if access token is available
   */
  if (props.token?.access_token) {
    // headers
    const requestHeaders: any = {};

    // body
    const requestBody: any = {
      token_type_hint: props.params.isRefreshToken
        ? "refresh_token"
        : "access_token",
      token: props.params.isRefreshToken
        ? props.token?.refresh_token
        : props.token?.access_token,
    };

    /**
     * Client authentication
     * ----------------------
     */
    if (props.config.oauthOptions.basicAuthHeader === false) {
      requestBody["client_id"] = props.config.oauthOptions.clientId;
      requestBody["client_secret"] = props.config.oauthOptions.clientSecret;
    } else {
      requestHeaders["Authorization"] = generateBasicAuthentication(
        props.config.oauthOptions.clientId,
        props.config.oauthOptions.clientSecret ?? ""
      );
    }

    /**
     * Request a token
     */
    requestToken<T>({
      accessTokenUrl: props.accessTokenUrl,
      body: requestBody,
      config: props.config,
      headers: requestBody,
      onError: props.onError,
      onSuccess: props.onSuccess,
      requestOptions: props.requestOptions,
    });
  } else {
    throw new Error("Access token is required");
  }
}
