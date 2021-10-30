import RequestOptions from "./RequestOptions";

type TokenRequestType<T = any> = {
  requestOptions?: RequestOptions;
  onSuccess?: (data: T, state?: string) => void;
  onError?: (error: any) => void;
  log?: boolean;
};

export default TokenRequestType;
