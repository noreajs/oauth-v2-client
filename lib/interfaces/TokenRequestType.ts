import { AxiosError } from "axios";
import RequestOptions from "./RequestOptions";

type TokenRequestType<T = any> = {
  requestOptions?: RequestOptions;
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError<any>) => void;
};

export default TokenRequestType;