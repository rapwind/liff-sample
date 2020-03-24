/* eslint import/prefer-default-export: 0 */
import DynamoDB from "../../../repository/dynamodb";
import Context, { Event, Result } from "../../../context";

const { DYNAMODB_USERS_TABLE, DYNAMODB_MESSAGES_TABLE } = process.env;

export const handler = async (event: Event): Promise<Result> => {
  const context = new Context(event);
  if (!context.isAdmin() && !context.isOwn()) {
    return {
      statusCode: 401
    };
  }

  const { userId } = event.pathParameters;
  const { lastName, firstName, nickName } = JSON.parse(event.body);
  if (!userId || !lastName || !firstName || !nickName) {
    return {
      statusCode: 400
    };
  }

  const dynamo = new DynamoDB({
    users: DYNAMODB_USERS_TABLE,
    messages: DYNAMODB_MESSAGES_TABLE
  });

  try {
    await dynamo.updateUser({
      id: userId,
      firstName,
      lastName,
      nickName
    });
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }

  return {
    statusCode: 204
  };
};
