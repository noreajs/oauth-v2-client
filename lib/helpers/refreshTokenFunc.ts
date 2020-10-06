import { Obj } from "@noreajs/common";
import Axios from "axios";
import {
  OauthClientConfig,
  RefreshTokenFuncType,
  TokenResponse,
} from "../interfaces";
import generateBasicAuthentication from "./basicAuthFunc";
import injectQueryParams from "./injectQueryParamsFunc";
import renderRequestBody from "./renderRequestBodyFunc";

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
     * Final payloads
     */
    const headers = Obj.merge(
      requestHeaders,
      Obj.merge(
        props.params.requestOptions?.headers ?? {},
        props.config.requestOptions?.headers ?? {}
      )
    );

    // query parameters
    const queryParams = Obj.merge(
      props.params.requestOptions?.query ?? {},
      props.config.requestOptions?.query ?? {}
    );

    //body
    const body = Obj.merge(
      requestBody,
      Obj.merge(
        props.params.requestOptions?.body ?? {},
        props.config.requestOptions?.body ?? {}
      )
    );

    /**
     * Getting the token
     * --------------------
     */
    await Axios.post(
      injectQueryParams(props.accessTokenUrl, queryParams),
      renderRequestBody(
        props.params.requestOptions?.bodyType ??
          props.config.requestOptions?.bodyType ??
          "json",
        body
      ),
      {
        headers: headers,
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
    throw new Error("Refresh token is required");
  }
}
