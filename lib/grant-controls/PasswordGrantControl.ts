import { Obj } from "@noreajs/common";
import Axios from "axios";
import PasswordGrantFuncType from "../interfaces/PasswordGrantFuncType";
import PasswordGrantOptions from "../interfaces/PasswordGrantOptions";
import RequestOptions from "../interfaces/RequestOptions";
import GrantControl from "./GrantControl";

export default class PasswordGrantControl extends GrantControl {
  private options: PasswordGrantOptions;
  private requestOptions: RequestOptions;

  constructor(requestOptions: RequestOptions, options: PasswordGrantOptions) {
    super();

    this.options = options;
    this.requestOptions = requestOptions;
  }

  async getToken<T = any>(params: PasswordGrantFuncType<T>) {
    // headers
    const requestHeaders: any = {};

    // body
    const requestBody: any = {
      grant_type: "password",
      username: params.username ?? this.options.username,
      password: params.password ?? this.options.password,
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
      requestHeaders["Authorization"] = this.generateBasicAuthentication(
        this.options.clientId,
        this.options.clientSecret ?? ""
      );
    }

    /**
     * Getting the token
     * --------------------
     */
    await Axios.post(
      this.injectQueryParams(
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
}
