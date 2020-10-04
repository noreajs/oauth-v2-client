import { Obj } from "@noreajs/common";
import Axios from "axios";
import {
  OauthClientConfig,
  RefreshTokenFuncType,
  TokenResponse,
} from "../interfaces";
import generateBasicAuthentication from "./basicAuthFunc";
import injectQueryParams from "./injectQueryParamsFunc";

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
     * Getting the token
     * --------------------
     */
    await Axios.post(
      injectQueryParams(
        props.accessTokenUrl,
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
    console.error("Refresh token is required");
  }
}
