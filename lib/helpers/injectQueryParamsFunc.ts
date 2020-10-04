/**
 * Add url's query params
 * @param url URL
 * @param params inject query params in the given URL
 */
export default function injectQueryParams(url: string, params: any) {
  // constructing the request
  const urlObj = new URL(url);

  for (const key in params ?? {}) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      // setting the param
      urlObj.searchParams.set(key, value);
    }
  }

  return urlObj.toString();
}
