export default interface OauthOptions {
  callbackUrl?: string;
  authUrl: string;
  accessTokenUrl?: string;
  clientId: string;
  clientSecret?: string;
  scopes?: Array<string>;
  state?: string;
  username?: string;
  password?: string;
  codeChallengeMethod?: "S256" | "plain";
  codeVerifier?: string;
  basicAuthHeader?: boolean;
  apiBaseURL?: string;
  jwtToken?: string;
}
