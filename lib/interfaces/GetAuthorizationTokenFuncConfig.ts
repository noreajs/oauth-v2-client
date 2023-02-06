import TokenRequestType from "./TokenRequestType";

type GetAuthorizationTokenFuncConfig<T = any> = TokenRequestType<T> & {
  /**
   * Callback URL as received from the authority server
   * 
   * ```javascript
   * // When using express
   * const callbackUrl = req.originalUrl;
   * ```
   */
  callbackUrl: string;

  /**
   * The same redirect_uri used to generate the auth uri (getAuthUri).
   * Leave it undefined when you don't use custom redirect_uri
   */
  redirectUri?: string;
  state?: string | string[];
};

export default GetAuthorizationTokenFuncConfig;
