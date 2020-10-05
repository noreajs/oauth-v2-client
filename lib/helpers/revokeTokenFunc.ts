import { Obj } from "@noreajs/common";
import Axios from "axios";
import { OauthClientConfig, TokenResponse } from "../interfaces";
import RevokeTokenFuncType from "../interfaces/RevokeTokenFuncType";
import generateBasicAuthentication from "./basicAuthFunc";
import injectQueryParams from "./injectQueryParamsFunc";

/**
 * Revoke a token
 * @param props function property
 */
export default async function revokeToken<T = any>(props: {
  params: RevokeTokenFuncType<T>;
  accessTokenUrl: string;
  token?: TokenResponse;
  config: OauthClientConfig;
  onSuccess: (data: any) => void;
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
     * Getting the token
     * --------------------
     */
    await Axios.post(
      injectQueryParams(
        props.accessTokenUrl.endsWith("/")
          ? `${props.accessTokenUrl}revoke`
          : `${props.accessTokenUrl}/revoke`,
        Obj.merge(
          props.params.requestOptions?.query ?? {},
          props.config.requestOptions?.query ?? {}
        )
      ),
      Obj.merge(requestBody, props.config.requestOptions?.body ?? {}),
      {
        headers: Obj.merge(
          requestHeaders,
          props.config.requestOptions?.headers ?? {}
        ),
      }
    )
      .then((response) => {
        // internal success callback
        props.onSuccess(response.data);

        // call callback
        if (props.params.onSuccess) props.params.onSuccess(response.data);
      })
      .catch((error) => {
        if (props.params.onError) props.params.onError(error);
      });
  } else {
    throw new Error("Access token is required");
  }
}
