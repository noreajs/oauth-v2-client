# Oauth v2 Client
[![Version](https://img.shields.io/npm/v/oauth-v2-client.svg)](https://npmjs.org/package/oauth-v2-client) [![Downloads/week](https://img.shields.io/npm/dw/oauth-v2-client.svg)](https://npmjs.org/package/oauth-v2-client) [![License](https://img.shields.io/npm/l/@noreajs/cli.svg)](https://github.com/noreajs/mongoose/blob/master/package.json)

Oauth 2.0 client for node.js, based on [Axios](https://www.npmjs.com/package/axios).

> This package covers access to tokens, renewal of tokens, and injection of the token in Axios request config



### Installation

```powershell
npm install oauth-v2-client
```

### Usage

Here is how we create an instance of the module for your API.

```typescript
import OauthClient from "oauth-v2-client";

const api = new OauthClient({
  oauthOptions: {
    clientId: "client_id_value",
    clientSecret: "client_secret_value",
    callbackUrl: "http://my-app.example.com/callback",
    accessTokenUrl: "https://example.com/oauth2/access_token",
    authUrl: "https://example.com/oauth2/authorize",
    apiBaseURL: "https://api.example.com",
  }
});
```

> The options used in the example above are optional for the most part, and are only part of the available options, which we will list in the next section.



**Global Options**

The object used to initialize the module has two properties:

- **oauthOptions**: for oauth options (*required*)
- **requestOptions**: global request options (*optional*)
  - **query**: *global URL query parameters*
  - **headers**: *global headers*
  - **body**: *global body*
  - **bodyType**:  `json` | `x-www-form-urlencoded`



**oauthOptions properties**

| Property            | Type   | Required | Default                          | Description                                                  |
| ------------------- | ------ | -------- | -------------------------------- | ------------------------------------------------------------ |
| callbackUrl         | string | false    |                                  | The callback URL should match the one you use during the application registration process. |
| authUrl             | string | true     |                                  | The endpoint for authorization server. This is used to get the authorization code. |
| accessTokenUrl      | string | false    |                                  | The endpoint for authentication server. This is used to exchange the authorization code for an access token. |
| clientId            | string | true     |                                  | The client identifier issued to the client during the application registration process. |
| clientSecret        | string | false    |                                  | The client secret issued to the client during the application registration process. |
| scopes              | array  | false    |                                  | The scopes of the access request.                            |
| state               | string | false    | generated when needed if missing | An opaque value that is used for preventing cross-site request forgery |
| username            | string | false    |                                  | username for Password Grant                                  |
| password            | string | false    |                                  | password for Password Grant                                  |
| codeChallengeMethod | string | false    | S256                             | Algorithm used for generating the Code Challenge             |
| codeVerifier        | string | false    | generated when needed if missing | A random, 43-128 character string used to connect the authorization request to the token request. [RFC spec](https://tools.ietf.org/html/rfc7636#section-4.1) |
| basicAuthHeader     | string | false    |                                  | Send credentials as basic authentication header              |
| apiBaseURL          | string | false    |                                  | Your api base url                                            |
| jwtToken            | string | false    |                                  | JWT token for jwt grant                                      |



## Grants

### Implicit Grant

The implicit grant is a simplified authorization code flow optimized for clients implemented in a browser using a scripting language such as JavaScript.  In the implicit flow, instead of issuing the client an authorization code, the client is issued an access token directly.

**Get redirect uri**

```typescript
api.implicit.getAuthUri()
```

**Extract token**

```typescript
api.implicit.getToken(callback)
```

**Full Example**  (Node.js + Typescript)

> Dependencies: body-parser, express, oauth-v2-client

```typescript
import express from "express";
import http from "http";
import OauthClient from "oauth-v2-client";

const app = express();
const httpServer = http.createServer(app);

const api = new OauthClient({
  oauthOptions: {
    clientId: "client_id_value",
    clientSecret: "client_secret_value",
    callbackUrl: "http://localhost:3000/callback",
    accessTokenUrl: "https://example.com/oauth/token",
    authUrl: "https://example.com/oauth/authorize"
  }
});

// redirect to provider authentication page
app.get("/oauth/implicit", function (req, res) {
  res.redirect(api.implicit.getAuthUri());
});

// extract token in the callback
app.get("/callback", function (req, res) {
  res.json(api.implicit.getToken(req.originalUrl));
});

httpServer.listen(3000);
```



### Authorization Code Grant

The authorization code grant type is used to obtain both access tokens and refresh tokens and is optimized for confidential clients. Since this is a redirection-based flow, the client must be capable of interacting with the resource owner's user-agent (*typically a web browser*) and capable of receiving incoming requests (*via redirection*) from the authorization server.

**Get redirect uri**

```typescript
api.authorizationCode.getAuthUri()
```

**Get token**

```typescript
api.authorizationCode.getToken({
    callbackUrl: callback,
    onSuccess: (data) => {
		// code here
    },
    onError: (error) => {
     	// handle error here
    },
  });
```

**Full Example ** (Node.js + Typescript)

> Dependencies: body-parser, express, oauth-v2-client

```typescript
import express from "express";
import http from "http";
import OauthClient from "oauth-v2-client";

const app = express();
const httpServer = http.createServer(app);

const api = new OauthClient({
  oauthOptions: {
    clientId: "client_id_value",
    clientSecret: "client_secret_value",
    callbackUrl: "http://localhost:3000/callback",
    accessTokenUrl: "https://example.com/oauth/token",
    authUrl: "https://example.com/oauth/authorize"
  }
});

// redirect to provider authentication page
app.get("/oauth/auth-code", function (req, res) {
  res.redirect(api.authorizationCode.getAuthUri());
});

// extract code in the callback add request the token
app.get("/callback", async function (req, res) {
    await api.authorizationCode.getToken({
        callbackUrl: req.originalUrl,
        onSuccess: (data) => {
          	return res.status(200).json(data);
        },
        onError: (error) => {
          	return res.status(500).json(error.response?.data);
        },
    });
});

httpServer.listen(3000);
```

### Authorization Code PKCE Grant

> OAuth 2.0 public clients utilizing the Authorization Code Grant are susceptible to the authorization code interception attack.

PKCE ([RFC 7636](https://tools.ietf.org/html/rfc7636)) is an extension to the authorization code flow to prevent several attacks and to be able to securely perform the OAuth exchange from public clients.

**Get redirect uri**

```typescript
api.authorizationCodePKCE.getAuthUri()
```

**Get token**

```typescript
api.authorizationCodePKCE.getToken({
    callbackUrl: callback,
    onSuccess: (data) => {
		// code here
    },
    onError: (error) => {
     	// handle error here
    },
});
```

**Full Example ** (Node.js + Typescript)

> Dependencies: body-parser, express, oauth-v2-client

```typescript
import express from "express";
import http from "http";
import OauthClient from "oauth-v2-client";

const app = express();
const httpServer = http.createServer(app);

const api = new OauthClient({
  oauthOptions: {
    clientId: "client_id_value",
    clientSecret: "client_secret_value",
    callbackUrl: "http://localhost:3000/callback",
    accessTokenUrl: "https://example.com/oauth/token",
    authUrl: "https://example.com/oauth/authorize"
  }
});

// redirect to provider authentication page
app.get("/oauth/auth-code-pkce", function (req, res) {
  res.redirect(api.authorizationCodePKCE.getAuthUri());
});

// extract code in the callback add request the token
app.get("/callback", async function (req, res) {
    await api.authorizationCodePKCE.getToken({
        callbackUrl: req.originalUrl,
        onSuccess: (data) => {
          	return res.status(200).json(data);
        },
        onError: (error) => {
          	return res.status(500).json(error.response?.data);
        },
    });
});

httpServer.listen(3000);
```



### Password Grant

The resource owner password credentials (**i.e.**, *username and password*) can be used directly as an authorization grant to obtain an access token.  The credentials should only be used when there is a high degree of trust between the resource owner and the client (**e.g**., *the client is part of the device operating system or a highly privileged application*), and when other authorization grant types are not available (*such as an authorization code*).

**Get token method**

```typescript
await api.password.getToken({
    username: req.body.username,
    password: req.body.password,
    onSuccess: (data) => {
		// code here
    },
    onError: (error) => {
		// handle error
    },
});
```

**Full example** (Node.js + Typescript)

> Dependencies: body-parser, express, oauth-v2-client

```typescript
import { json } from "body-parser";
import express from "express";
import http from "http";
import OauthClient from "oauth-v2-client";

const app = express();
const httpServer = http.createServer(app);

const api = new OauthClient({
  oauthOptions: {
    clientId: "client_id_value",
    clientSecret: "client_secret_value",
    accessTokenUrl: "https://example.com/oauth/token"
  }
});

app.post("/oauth/password", [
  json(),
  async function (req: any, res: any) {
    try {
        // get the the token from credentials
      await api.password.getToken({
        username: req.body.username,
        password: req.body.password,
        onSuccess: (data) => {
          return res.status(200).json(api.password.token);
        },
        onError: (error) => {
          return res.status(500).json(error.response?.data);
        },
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
]);

httpServer.listen(3000);
```



### Client Credentials Grant

The client credentials (*or other forms of client authentication*) can be used as an authorization grant when the authorization scope is limited to the protected resources under the control of the client, or to protected resources previously arranged with the authorization server.  Client credentials are used as an authorization grant typically when the client is acting on its own behalf (*the client is also the resource owner*) or is requesting access to protected resources based on an authorization previously arranged with the authorization server.

**Get token method**

```typescript
await api.client.getToken({
    onSuccess: (data) => {
		// code here
    },
    onError: (error) => {
		// handle error
	},
});
```

**Full example** (Node.js + Typescript)

> Dependencies: body-parser, express, oauth-v2-client

```typescript
import { json } from "body-parser";
import express from "express";
import http from "http";
import OauthClient from "oauth-v2-client";

const app = express();
const httpServer = http.createServer(app);

const api = new OauthClient({
  oauthOptions: {
    clientId: "client_id_value",
    clientSecret: "client_secret_value",
    accessTokenUrl: "https://example.com/oauth/token"
  }
});

app.post("/oauth/client", [
  json(),
  async function (req: any, res: any) {
    await api.client.getToken({
      onSuccess: (data) => {
        return res.status(200).json(data);
      },
      onError: (error) => {
        return res.status(500).json(error.response?.data);
      },
    });
  },
]);

httpServer.listen(3000);
```



### JWT Grant

JWT Bearer Token is for client authentication. To use a Bearer JWT as an authorization grant, the client uses an access token request as defined in [Section 4](https://tools.ietf.org/html/rfc7523#section-4) of the OAuth Assertion Framework [[RFC7521](https://tools.ietf.org/html/rfc7521)] with the following specific parameter values and encodings.

**Get token method**

```typescript
await api.jwt.getToken({
    onSuccess: (data) => {
		// code here
    },
    onError: (error) => {
		// handle error
	},
});
```

**Full example** (Node.js + Typescript)

> Dependencies: body-parser, express, oauth-v2-client

```typescript
import { json } from "body-parser";
import express from "express";
import http from "http";
import OauthClient from "oauth-v2-client";

const app = express();
const httpServer = http.createServer(app);

const api = new OauthClient({
    oauthOptions: {
        clientId: "client_id_value",
        clientSecret: "client_secret_value",
        accessTokenUrl: "https://example.com/oauth/token",
        jwtToken: "easdqd---- A JWT TOKEN -----jmlu"
    }
});

app.post("/oauth/jwt", [
    json(),
    async function (req: any, res: any) {
        await api.jwt.getToken({
            grant_type: "urn:example-provider:oauth2:jwt", // just an example
            onSuccess: (data) => {
                return res.status(200).json(data);
            },
            onError: (error) => {
                return res.status(500).json(error.response?.data);
                                            },
        });
    },
]);

httpServer.listen(3000);
```



## Sign & Restore

### Sign API requests

For all grants, there is a method call **sign** which help to sign Axios requests.

`Sign` method takes an object as a unique parameter which has all **AxiosRequestConfig** properties, and those 2 additional properties:

- **proxy**: *Use `Proxy-Authorization` instead of `Authorization`*
- **token_type**: *By default, the first letter of the token type is uppercase. This property is used to override the default token type.*



Example with authorization code *(Node.Js +  Typescript)*

```typescript
// using http helper (get, post, put etc)
await Axios.get("/2.0/user/emails", api.authorizationCode.sign()).then((response) => {
      return res.status(200).json(response.data);
}).catch((error) => {
      return res.status(500).json(error);
});

// using custom request
await Axios.request(api.authorizationCode.sign({
    method: "get",
    url: "/2.0/user/emails"
})).then((response) => {
      return res.status(200).json(response.data);
}).catch((error) => {
      return res.status(500).json(error);
});
```



### Restore Token

Very often you may need to save the token for later use. There is a method that allows you to restore the token and perform your operations. This method is called **setToken**.



Example with authorization code *(Node.Js +  Typescript)*

```typescript
api.authorizationCode.setToken(token_data)
```



### Licence

Apache M.I.T