/* eslint import/prefer-default-export: 0 */
import Cognito from "../../../repository/cognito";
import Context, { Event, Result } from "../../../context";

const { COGNITO_USER_POOL_ID } = process.env;

export const handler = async (event: Event): Promise<Result> => {
  const context = new Context(event);
  if (!context.isAdmin()) {
    return {
      statusCode: 401
    };
  }

  const { groupName } = event.pathParameters;
  if (groupName.includes(COGNITO_USER_POOL_ID) || groupName === "Admin") {
    return {
      statusCode: 400
    };
  }
  const cognito = new Cognito({
    userPoolId: COGNITO_USER_POOL_ID
  });
  await cognito.deleteGroup(groupName);
  return {
    statusCode: 204
  };
};
