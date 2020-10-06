import { AxiosError } from "axios";
import TokenRequestType from "./TokenRequestType";

type PasswordGrantFuncType<T = any> = TokenRequestType<T> & {
  username?: string;
  password?: string;
};

export default PasswordGrantFuncType;
