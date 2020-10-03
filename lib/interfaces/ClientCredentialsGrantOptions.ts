export default interface ClientCredentialsGrantOptions {
    accessTokenUrl: string;
    clientId: string;
    clientSecret?: string;
    scope?: Array<string>;
    basicAuthHeader?: boolean;
}