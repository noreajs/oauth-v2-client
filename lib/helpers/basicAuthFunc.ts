

/**
 * Generate basic authentication header value
 * @param username username
 * @param password password
 */
export default function generateBasicAuthentication(
  username: string,
  password: string
) {
  // we are in a node js environment
  if (typeof Buffer !== 'undefined') {
    return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  } else if (typeof btoa === "function") {
    // browser environemnt
    return `Basic ${btoa(`${username}:${password}`)}`;
  } else {
    throw new Error('Unable to create the base 64 string.')
  }
}
