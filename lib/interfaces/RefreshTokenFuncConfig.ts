import { AxiosError } from "axios";
import TokenRequestType from "./TokenRequestType";

type RefreshTokenFuncConfig<T = any> = TokenRequestType<T> & {};

export default RefreshTokenFuncConfig;
