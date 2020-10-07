export default interface ClientCredentialsGrantOptions {
    accessTokenUrl: string;
    clientId: string;
    clientSecret?: string;
    scopes?: Array<string>;
    basicAuthHeader?: boolean;
}