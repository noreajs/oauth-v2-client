import { AxiosError } from "axios";
import RequestOptions from "./RequestOptions";

type RevokeTokenFuncType<T = any> = {
  isRefreshToken: boolean;
  requestOptions?: RequestOptions;
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError<any>) => void;
};

export default RevokeTokenFuncType;
