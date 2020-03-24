/* eslint import/prefer-default-export: 0 */
import Cognito from "../../repository/cognito";
import Context, { Event, Result } from "../../context";

const { COGNITO_USER_POOL_ID } = process.env;

export const handler = async (event: Event): Promise<Result> => {
  const context = new Context(event);
  if (!context.isAdmin()) {
    return {
      statusCode: 401
    };
  }

  const req = JSON.parse(event.body);
  if (!req.name) {
    return {
      statusCode: 400
    };
  }

  const cognito = new Cognito({
    userPoolId: COGNITO_USER_POOL_ID
  });
  const { Group } = await cognito.createGroup(req.name);
  return {
    statusCode: 200,
    body: JSON.stringify(Group)
  };
};
