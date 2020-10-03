import express from "express";
import http from "http";
import OauthClient from "../OauthClient";
const app = express();

const httpServer = http.createServer(app);

const noreaApi = new OauthClient({
  oauthOptions: {
    clientId: "2054f3ef-7360-4779-b01c-5bb8ee09f61b",
    clientSecret: "9c40df4a551e2d92e45026ef5189f4116ffde949963a826c94d6b7f5f12a9a99f90d3a3cdbdd2dd840ea0c0b665cd8babca4cbac214fd09915f18ac824b41258",
    callbackUrl: "http://127.0.0.1:3500/implicit/callback",
    accessTokenUrl: "http://localhost:3000/oauth/v2/token",
    authUrl: "http://localhost:3000/oauth/v2/authorize"
  }
})

/**
 * Implicit
 * --------------
 */
app.get('/oauth/implicit', function (req, res) {
  res.redirect(noreaApi.implicit.getAuthUri());
})

app.get("/implicit/callback", function (req, res) {
  res.json(noreaApi.implicit.getToken(req.originalUrl))
});

/**
 * Authorization code
 * -----------------------
 */
app.get('/oauth/auth-code', function (req, res) {
  res.redirect(noreaApi.authorizationCode.getAuthUri());
})

app.get("/auth-code/callback",async function (req, res) {
  res.json(await noreaApi.authorizationCode.getToken(req.originalUrl))
});


/**
 * Authorization code PKCE
 * ----------------------------
 */
app.get('/oauth/auth-code-pkce', function (req, res) {
  res.redirect(noreaApi.authorizationCodePKCE.getAuthUri());
})

app.get("/auth-code-pkce/callback",async function (req, res) {
  res.json(await noreaApi.authorizationCodePKCE.getToken(req.originalUrl))
});


/**
 * Home
 */
app.get("/", function (req, res) {
  res.json({
    message: 'Hey we there'
  })
});

httpServer.listen(3500);
