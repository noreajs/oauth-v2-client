export default interface OauthOptions {
  callbackUrl?: string;
  authUrl: string;
  accessTokenUrl?: string;
  clientId: string;
  clientSecret?: string;
  scopes?: Array<string>;
  username?: string;
  password?: string;
  codeChallengeMethod?: "S256" | "plain";
  basicAuthHeader?: boolean;
  apiBaseURL?: string;
  jwtToken?: string;
}
