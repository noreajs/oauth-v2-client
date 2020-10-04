import { json } from "body-parser";
import express from "express";
import http from "http";
import OauthClient from "../OauthClient";
const app = express();

const httpServer = http.createServer(app);

const noreaApi = new OauthClient({
  oauthOptions: {
    clientId: "2054f3ef-7360-4779-b01c-5bb8ee09f61b",
    clientSecret:
      "9c40df4a551e2d92e45026ef5189f4116ffde949963a826c94d6b7f5f12a9a99f90d3a3cdbdd2dd840ea0c0b665cd8babca4cbac214fd09915f18ac824b41258",
    callbackUrl: "http://127.0.0.1:3500/implicit/callback",
    accessTokenUrl: "http://localhost:3000/oauth/v2/token",
    authUrl: "http://localhost:3000/oauth/v2/authorize",
  },
  requestOptions: {
    body: {
      baby: "boom",
    },
    headers: {
      Accept: "application/json",
    },
  },
});

/**
 * Implicit
 * --------------
 */
app.get("/oauth/implicit", function (req, res) {
  res.redirect(noreaApi.implicit.getAuthUri());
});

app.get("/implicit/callback", function (req, res) {
  res.json(noreaApi.implicit.getToken(req.originalUrl));
});

/**
 * Authorization code
 * -----------------------
 */
app.get("/oauth/auth-code", function (req, res) {
  res.redirect(
    noreaApi.authorizationCode.getAuthUri({
      callbackUrl: "http://127.0.0.1:3500/auth-code/callback",
    })
  );
});

app.get("/auth-code/callback", async function (req, res) {
  await noreaApi.authorizationCode.getToken({
    callbackUrl: req.originalUrl,
    onSuccess: (data) => {
      return res.status(200).json(data);
    },
    onError: (error) => {
      return res.status(500).json(error.response?.data);
    },
  });
});

/**
 * Authorization code PKCE
 * ----------------------------
 */
app.get("/oauth/auth-code-pkce", function (req, res) {
  res.redirect(
    noreaApi.authorizationCodePKCE.getAuthUri({
      callbackUrl: "http://127.0.0.1:3500/auth-code-pkce/callback",
    })
  );
});

app.get("/auth-code-pkce/callback", async function (req, res) {
  await noreaApi.authorizationCodePKCE.getToken({
    callbackUrl: req.originalUrl,
    onSuccess: (data) => {
      return res.status(200).json(data);
    },
    onError: (error) => {
      return res.status(500).json(error.response?.data);
    },
  });
});

/**
 * Password
 * -----------------------------------
 */
app.post("/oauth/password", [
  json(),
  async function (req: any, res: any) {
    try {
      await noreaApi.password.getToken({
        username: req.body.username,
        password: req.body.password,
        onSuccess: (data) => {
          return res.status(200).json(noreaApi.password.token);
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

app.get("/oauth/password/refresh", async function (req: any, res: any) {
  await noreaApi.password.refresh({
    onSuccess: (data) => {
      return res.status(200).json(noreaApi.password.token);
    },
    onError: (error) => {
      return res.status(500).json(error.response?.data);
    },
  });
});

/**
 * Client credentials
 * -----------------------------------
 */
app.post("/oauth/client", [
  json(),
  async function (req: any, res: any) {
    await noreaApi.client.getToken({
      onSuccess: (data) => {
        return res.status(200).json(data);
      },
      onError: (error) => {
        return res.status(500).json(error.response?.data);
      },
    });
  },
]);

/**
 * Home
 */
app.get("/", function (req, res) {
  res.json({
    message: "Hey we there",
  });
});

httpServer.listen(3500);
