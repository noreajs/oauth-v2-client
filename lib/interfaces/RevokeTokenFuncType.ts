import { AxiosError } from "axios";
import TokenRequestType from "./TokenRequestType";

type RevokeTokenFuncType<T = any> = TokenRequestType<T> & {
  isRefreshToken: boolean;
};

export default RevokeTokenFuncType;
