export default interface ImplicitGrantOptions {
  callbackUrl: string;
  authUrl: string;
  clientId: string;
  scopes?: Array<string>;
  state?: string;
  basicAuthHeader?: boolean;
}
