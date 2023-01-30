import { AxiosRequestConfig } from "axios";
import TokenResponse from "./TokenResponse";

type SignFuncConfig = AxiosRequestConfig & {
  proxy?: boolean;
  token: TokenResponse
};

export default SignFuncConfig;
