import { AxiosError } from "axios";
import RequestOptions from "./RequestOptions";

type PasswordGrantFuncType<T = any> = {
  username?: string;
  password?: string;
  requestOptions?: RequestOptions;
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError<any>) => void;
};

export default PasswordGrantFuncType;
