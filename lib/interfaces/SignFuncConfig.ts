import { AxiosRequestConfig } from "axios";

type SignFuncConfig = AxiosRequestConfig & {
  proxy?: boolean;
  token_type?: string;
};

export default SignFuncConfig;
