import { AxiosError } from "axios";
import TokenRequestType from "./TokenRequestType";

type ClientCredentialsGrantFuncType<T = any> = TokenRequestType<T> & {};

export default ClientCredentialsGrantFuncType;
