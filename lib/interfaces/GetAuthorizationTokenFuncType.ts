import { AxiosError } from "axios";
import RequestOptions from "./RequestOptions";

type GetAuthorizationTokenFuncType<T = any> = {
  callbackUri: string;
  requestOptions?: RequestOptions;
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError<any>) => void;
};

export default GetAuthorizationTokenFuncType;
