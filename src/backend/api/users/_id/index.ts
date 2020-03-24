/* eslint import/prefer-default-export: 0 */
import DynamoDB from "../../../repository/dynamodb";
import Cognito from "../../../repository/cognito";
import Context, { Event, Result } from "../../../context";

const {
  COGNITO_USER_POOL_ID,
  DYNAMODB_USERS_TABLE,
  DYNAMODB_MESSAGES_TABLE
} = process.env;

export const handler = async (event: Event): Promise<Result> => {
  const context = new Context(event);
  if (!context.isAdmin() && !context.isOwn()) {
    return {
      statusCode: 401
    };
  }

  try {
    const { userId } = event.pathParameters;
    const dynamo = new DynamoDB({
      users: DYNAMODB_USERS_TABLE,
      messages: DYNAMODB_MESSAGES_TABLE
    });
    const cognito = new Cognito({ userPoolId: COGNITO_USER_POOL_ID });

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...(await dynamo.getUser(userId)),
        ...(await cognito.getUser(userId))
      })
    };
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
};
