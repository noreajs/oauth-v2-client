import { AxiosError } from "axios";
import TokenRequestType from "./TokenRequestType";

type ClientCredentialsGrantFuncConfig<T = any> = TokenRequestType<T> & {};

export default ClientCredentialsGrantFuncConfig;
