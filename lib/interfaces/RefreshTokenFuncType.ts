import { AxiosError } from "axios";
import TokenRequestType from "./TokenRequestType";

type RefreshTokenFuncType<T = any> = TokenRequestType<T> & {};

export default RefreshTokenFuncType;
