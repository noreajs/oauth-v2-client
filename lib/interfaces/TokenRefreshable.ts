import RefreshTokenFuncType from "./RefreshTokenFuncType";

export default interface TokenRefreshable {
  refresh<T = any>(params: RefreshTokenFuncType<T>): void | Promise<void>;
}
