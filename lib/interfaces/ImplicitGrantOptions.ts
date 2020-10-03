export default interface ImplicitGrantOptions {
  callbackUrl: string;
  authUrl: string;
  clientId: string;
  scope?: Array<string>;
  state?: string;
  basicAuthHeader?: boolean;
}
