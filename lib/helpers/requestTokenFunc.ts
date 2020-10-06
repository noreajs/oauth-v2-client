import { Obj } from "@noreajs/common";
import Axios from "axios";
import { OauthClientConfig } from "../interfaces";
import TokenRequestType from "../interfaces/TokenRequestType";
import injectQueryParams from "./injectQueryParamsFunc";
import renderRequestBody from "./renderRequestBodyFunc";

/**
 * Request a token
 * @param props function property
 */
export default async function requestToken<T = any>(
  props: TokenRequestType<T> & {
    headers: any;
    body: any;
    accessTokenUrl: string;
    config: OauthClientConfig;
  }
) {
  // headers
  const headers = Obj.merge(
    props.headers,
    Obj.merge(
      props.requestOptions?.headers ?? {},
      props.config.requestOptions?.headers ?? {}
    )
  );

  // query parameters
  const queryParams = Obj.merge(
    props.requestOptions?.query ?? {},
    props.config.requestOptions?.query ?? {}
  );

  //body
  const body = Obj.merge(
    props.body,
    Obj.merge(
      props.requestOptions?.body ?? {},
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
      props.requestOptions?.bodyType ??
        props.config.requestOptions?.bodyType ??
        "json",
      body
    ),
    {
      headers: headers,
    }
  )
    .then((response) => {
      // call callback
      if (props.onSuccess) props.onSuccess(response.data);
    })
    .catch((error) => {
      if (props.onError) props.onError(error);
    });
}
