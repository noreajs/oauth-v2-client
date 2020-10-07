import { AxiosError } from "axios";
import TokenRequestType from "./TokenRequestType";

type PasswordGrantFuncConfig<T = any> = TokenRequestType<T> & {
  username?: string;
  password?: string;
};

export default PasswordGrantFuncConfig;
