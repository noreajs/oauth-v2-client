export default interface AuthorizationCodePKCEGrantOptions {
  callbackUrl: string;
  authUrl: string;
  accessTokenUrl: string;
  clientId: string;
  clientSecret?: string;
  scope?: Array<string>;
  state?: string;
  codeChallengeMethod: "S256" | "plain";
  codeVerifier?: string;
  basicAuthHeader?: boolean;
}
