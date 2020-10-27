import RequestOptions from "./RequestOptions";

type TokenRequestType<T = any> = {
  requestOptions?: RequestOptions;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
};

export default TokenRequestType;