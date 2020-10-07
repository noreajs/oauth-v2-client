export default interface PasswordGrantOptions {
  accessTokenUrl: string;
  username: string;
  password: string;
  clientId: string;
  clientSecret?: string;
  scopes?: Array<string>;
  basicAuthHeader?: boolean;
}
