import TokenRequestType from "./TokenRequestType";

type GetAuthorizationTokenFuncConfig<T = any> = TokenRequestType<T> & {
  callbackUrl: string;
  state?:string
};

export default GetAuthorizationTokenFuncConfig;
