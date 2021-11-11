export default interface AuthorizationCodeGrantOptions {
  callbackUrl: string;
  authUrl: string;
  accessTokenUrl: string;
  clientId: string;
  clientSecret?: string;
  scopes?: Array<string>;
  state?: string | string[];
  basicAuthHeader?: boolean;
}
