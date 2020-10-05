import RefreshTokenFuncType from "./RefreshTokenFuncType";

export default interface TokenRefreshable<T = any> {
  refresh<T>(params: RefreshTokenFuncType<T>): void | Promise<void>;
}
