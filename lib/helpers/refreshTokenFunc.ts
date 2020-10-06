import { Obj } from "@noreajs/common";
import { requestToken } from ".";
import {
  OauthClientConfig,
  RefreshTokenFuncType,
  TokenResponse,
} from "../interfaces";
import generateBasicAuthentication from "./basicAuthFunc";

/**
 * Refresh a token
 * @param props function property
 */
export default async function refreshToken<T = any>(props: {
  params: RefreshTokenFuncType<T>;
  accessTokenUrl: string;
  token?: TokenResponse;
  config: OauthClientConfig;
  onSuccess: (data: any) => void;
}) {
  /**
   * Only if refresh_token is available
   */
  if (props.token?.refresh_token) {
    // headers
    const requestHeaders: any = {};

    // body
    const requestBody: any = {
      grant_type: "refresh_token",
      refresh_token: props.token?.refresh_token,
      scope: props.config.oauthOptions.scope
        ? props.config.oauthOptions.scope.join(" ")
        : "",
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
      headers: requestHeaders,
      onError: props.params.onError,
      onSuccess: (data) => {
        // success callback
        props.onSuccess(data);
        // success param callback
        if (props.params.onSuccess) props.params.onSuccess(data);
      },
      requestOptions: props.params.requestOptions,
    });
  } else {
    throw new Error("Refresh token is required");
  }
}
