import { Obj } from "@noreajs/common";
import Axios from "axios";
import { refreshToken } from "../helpers";
import generateBasicAuthentication from "../helpers/basicAuthFunc";
import injectQueryParams from "../helpers/injectQueryParamsFunc";
import { OauthClientConfig } from "../interfaces";
import ClientCredentialsGrantFuncTyle from "../interfaces/ClientCredentialsGrantFuncTyle";
import ClientCredentialsGrantOptions from "../interfaces/ClientCredentialsGrantOptions";
import RefreshTokenFuncType from "../interfaces/RefreshTokenFuncType";
import TokenRefreshable from "../interfaces/TokenRefreshable";
import GrantControl from "./GrantControl";

export default class ClientCredentialsGrantControl extends GrantControl implements TokenRefreshable {
  private options: ClientCredentialsGrantOptions;

  constructor(
    config: OauthClientConfig,
    options: ClientCredentialsGrantOptions
  ) {
    super(config);

    this.options = options;
  }

  /**
   * Get Client Credentials Grant Token
   * @param params parameters
   */
  async getToken<T = any>(params: ClientCredentialsGrantFuncTyle<T>) {
    // headers
    const requestHeaders: any = {};

    // body
    const requestBody: any = {
      grant_type: "client",
      scope: this.options.scope ? this.options.scope.join(" ") : "",
    };

    /**
     * Client authentication
     * ----------------------
     */
    if (this.options.basicAuthHeader === false) {
      requestBody["client_id"] = this.options.clientId;
      requestBody["client_secret"] = this.options.clientSecret;
    } else {
      requestHeaders["Authorization"] = generateBasicAuthentication(
        this.options.clientId,
        this.options.clientSecret ?? ""
      );
    }

    /**
     * Getting the token
     * --------------------
     */
    await Axios.post(
      injectQueryParams(
        this.options.accessTokenUrl,
        Obj.merge(
          params.requestOptions?.query ?? {},
          this.requestOptions.query ?? {}
        )
      ),
      Obj.merge(requestBody, this.requestOptions.body ?? {}),
      {
        headers: Obj.merge(requestHeaders, this.requestOptions.headers ?? {}),
      }
    )
      .then((response) => {
        // update the token
        this.setToken(response.data);

        // call callback
        if (params.onSuccess) params.onSuccess(response.data);
      })
      .catch((error) => {
        if (params.onError) params.onError(error);
      });
  }

  /**
   * Refresh the token
   * @param params parameters
   */
  async refresh<T = any>(params: RefreshTokenFuncType<T>) {
    refreshToken<T>({
      accessTokenUrl: this.options.accessTokenUrl,
      config: {
        oauthOptions: this.oauthOptions,
        requestOptions: this.requestOptions,
      },
      onSuccess: (data) => {
        // update the token
        this.setToken(data);
      },
      params: params,
      token: this.token,
    });
  }
}
