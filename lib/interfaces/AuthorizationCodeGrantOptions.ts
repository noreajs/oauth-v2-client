export default interface AuthorizationCodeGrantOptions {
  callbackUrl: string;
  authUrl: string;
  accessTokenUrl: string;
  clientId: string;
  clientSecret?: string;
  scope?: Array<string>;
  state?: string;
  basicAuthHeader?: boolean;
}
