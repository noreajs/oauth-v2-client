import TokenRequestType from "./TokenRequestType";

type JWTGrantTokenFuncConfig<T = any> = TokenRequestType<T> & {
  grant_type: string;
  jwt_token?: string;
};

export default JWTGrantTokenFuncConfig;
