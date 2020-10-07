import { AxiosError } from "axios";
import RequestOptions from "./RequestOptions";
import TokenRequestType from "./TokenRequestType";

type GetAuthorizationTokenFuncConfig<T = any> = TokenRequestType<T> & {
  callbackUrl: string;
};

export default GetAuthorizationTokenFuncConfig;
