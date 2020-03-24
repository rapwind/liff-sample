/* eslint import/prefer-default-export: 0 */
import { Result } from "../../context";

export const handler = (): Result => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "ok"
    })
  };
};
