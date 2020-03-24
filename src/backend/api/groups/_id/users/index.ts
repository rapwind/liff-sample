/* eslint import/prefer-default-export: 0 */
import DynamoDB from "../../../../repository/dynamodb";
import Cognito from "../../../../repository/cognito";
import Context, { Event, Result } from "../../../../context";

const {
  DYNAMODB_USERS_TABLE,
  DYNAMODB_MESSAGES_TABLE,
  COGNITO_USER_POOL_ID
} = process.env;

export const handler = async (event: Event): Promise<Result> => {
  const context = new Context(event);
  if (!context.isAdmin()) {
    return {
      statusCode: 401
    };
  }

  const { groupName } = event.pathParameters;

  try {
    const dynamo = new DynamoDB({
      users: DYNAMODB_USERS_TABLE,
      messages: DYNAMODB_MESSAGES_TABLE
    });
    const cognito = new Cognito({ userPoolId: COGNITO_USER_POOL_ID });
    const users = await cognito.listUsersInGroup(groupName);
    return {
      statusCode: 200,
      body: JSON.stringify(
        await Promise.all(users.map(user => dynamo.getUser(user.id)))
      )
    };
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
};
