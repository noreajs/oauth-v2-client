export default interface PasswordGrantOptions {
  accessTokenUrl: string;
  username: string;
  password: string;
  clientId: string;
  clientSecret?: string;
  scope?: Array<string>;
  basicAuthHeader?: boolean;
}
