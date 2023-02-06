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
  state?: string | string[];
};

export default GetAuthorizationTokenFuncConfig;
