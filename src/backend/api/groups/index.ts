/* eslint import/prefer-default-export: 0 */
import Context, { Event, Result } from "../../context";
import Cognito from "../../repository/cognito";

const { COGNITO_USER_POOL_ID } = process.env;

export const handler = async (event: Event): Promise<Result> => {
  const context = new Context(event);
  if (!context.isAdmin()) {
    return {
      statusCode: 401
    };
  }

  const cognito = new Cognito({ userPoolId: COGNITO_USER_POOL_ID });
  const groups = await cognito.listGroups();

  return {
    statusCode: 200,
    body: JSON.stringify(groups.filter(group => group !== "Admin"))
  };
};
