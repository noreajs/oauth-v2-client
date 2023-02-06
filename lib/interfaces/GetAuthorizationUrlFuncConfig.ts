type GetAuthorizationUrlFuncConfig = {
  responseType?: string;
  state?: string;
  scopes?: string[];

  /**
   * Custom redirect_uri
   */
  callbackUrl?: string;
};

export default GetAuthorizationUrlFuncConfig;
