export default interface AuthorizationCodePKCEGrantOptions {
  callbackUrl: string;
  authUrl: string;
  accessTokenUrl: string;
  clientId: string;
  clientSecret?: string;
  scopes?: Array<string>;
  state?: string | string[];
  codeChallengeMethod: "S256" | "plain";
  codeVerifier?: string;
  basicAuthHeader?: boolean;
}
