import TokenRequestType from "./TokenRequestType";

type GetAuthorizationTokenFuncConfig<T = any> = TokenRequestType<T> & {
  callbackUrl: string;
  state?: string | string[];
};

export default GetAuthorizationTokenFuncConfig;
