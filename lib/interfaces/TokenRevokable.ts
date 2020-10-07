import RevokeTokenFuncConfig from "./RevokeTokenFuncConfig";

export default interface TokenRevokable<T=any> {
  revoke<T>(props: RevokeTokenFuncConfig<T>): void | Promise<void>;
}
