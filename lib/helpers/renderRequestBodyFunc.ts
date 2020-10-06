import { stringify } from "querystring";
import { RequestBodyType } from "../interfaces";

/**
 * Format request according to the body type
 * @param bodyType request body type
 * @param body request body
 */
export default function renderRequestBody(bodyType: RequestBodyType, body: any): any {
  switch (bodyType) {
    case "x-www-form-urlencoded":
      return stringify(body);

    default:
      return body;
  }
}
