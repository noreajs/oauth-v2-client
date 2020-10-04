/**
 * Generate basic authentication header value
 * @param username username
 * @param password password
 */
export default function generateBasicAuthentication(
  username: string,
  password: string
) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}
