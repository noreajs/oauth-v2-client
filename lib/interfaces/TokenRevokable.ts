export default interface TokenRevokable {
  revoke(): void | Promise<void>;
}
