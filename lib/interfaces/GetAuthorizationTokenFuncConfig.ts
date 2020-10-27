import TokenRequestType from "./TokenRequestType";

type GetAuthorizationTokenFuncConfig<T = any> = TokenRequestType<T> & {
  callbackUrl: string;
};

export default GetAuthorizationTokenFuncConfig;
