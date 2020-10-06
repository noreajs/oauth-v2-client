import { AxiosError } from "axios";
import RequestOptions from "./RequestOptions";
import TokenRequestType from "./TokenRequestType";

type GetAuthorizationTokenFuncType<T = any> = TokenRequestType<T> & {
  callbackUrl: string;
};

export default GetAuthorizationTokenFuncType;
