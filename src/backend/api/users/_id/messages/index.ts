/* eslint import/prefer-default-export: 0 */
import DynamoDB from "../../../../repository/dynamodb";
import Context, { Event, Result } from "../../../../context";

const { DYNAMODB_USERS_TABLE, DYNAMODB_MESSAGES_TABLE } = process.env;

export const handler = async (event: Event): Promise<Result> => {
  const context = new Context(event);
  if (!context.isAdmin) {
    return {
      statusCode: 401
    };
  }

  try {
    const dynamo = new DynamoDB({
      users: DYNAMODB_USERS_TABLE,
      messages: DYNAMODB_MESSAGES_TABLE
    });
    const { userId } = event.pathParameters;
    const messages = await dynamo.getMessagesByUserId(userId);
    return {
      statusCode: 200,
      body: JSON.stringify(messages)
    };
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
};
