import TokenRequestType from "./TokenRequestType";

type RevokeTokenFuncConfig<T = any> = TokenRequestType<T> & {
  isRefreshToken: boolean;
};

export default RevokeTokenFuncConfig;
