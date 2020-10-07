/**
 * Put the first later of the string in capital letter
 * @param value value to update
 */
export function capitalize(value?: string) {
  if (typeof value !== "string") return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
