import TokenRequestType from "./TokenRequestType";
import TokenResponse from "./TokenResponse";

type RefreshTokenFuncConfig<T = any> = TokenRequestType<T> & {
    token: TokenResponse
};

export default RefreshTokenFuncConfig;
