import RefreshTokenFuncConfig from "./RefreshTokenFuncConfig";

export default interface TokenRefreshable<T = any> {
  refresh<T>(params: RefreshTokenFuncConfig<T>): void | Promise<void>;
}
