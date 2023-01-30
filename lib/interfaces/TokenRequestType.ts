import RequestOptions from "./RequestOptions";

type TokenRequestType<T = any> = {
  requestOptions?: RequestOptions;
  onSuccess?: (data: T, state?: string) => void | Promise<void>;
  onError?: (error: any) => void | Promise<void>;
  log?: boolean;
};

export default TokenRequestType;
