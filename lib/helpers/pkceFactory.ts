import { enc, SHA1, SHA256 } from "crypto-js";
import { toASCII } from "punycode";

/**
 * Generate code verifier for PKCE implementation
 */
export function generateCodeVerifier() {
  return enc.Hex.stringify(SHA1(Math.random().toString(36)));
}

/**
 * Generate code challenge from code verifier
 * @param codeVerifier code verifier
 */
export function generateCodeChallenge(codeVerifier: string) {
  return enc.Base64.stringify(SHA256(toASCII(codeVerifier)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
