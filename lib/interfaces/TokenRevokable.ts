import RevokeTokenFuncType from "./RevokeTokenFuncType";

export default interface TokenRevokable<T=any> {
  revoke<T>(props: RevokeTokenFuncType<T>): void | Promise<void>;
}
