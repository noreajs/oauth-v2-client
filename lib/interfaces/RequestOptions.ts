import RequestBodyType from "./RequestBodyType";

export default interface RequestOptions {
  headers?: any;
  query?: any;
  body?: any;
  bodyType?: RequestBodyType;
}
