export default interface ImplicitGrantOptions {
  callbackUrl: string;
  authUrl: string;
  clientId: string;
  scopes?: Array<string>;
  basicAuthHeader?: boolean;
}
