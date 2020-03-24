/* eslint import/prefer-default-export: 0 */
import Message from "~/models/Message";
import DynamoDB from "../repository/dynamodb";
import LINE from "../repository/line";
import { build } from "../message/weather";
import { Result } from "../context";

const {
  LINE_CHANNELL_ACCESS_TOKEN,
  DYNAMODB_USERS_TABLE,
  DYNAMODB_MESSAGES_TABLE
} = process.env;

export const handler = async (): Promise<Result> => {
  const dynamo = new DynamoDB({
    users: DYNAMODB_USERS_TABLE,
    messages: DYNAMODB_MESSAGES_TABLE
  });
  const line = new LINE(dynamo, {
    channelAccessToken: LINE_CHANNELL_ACCESS_TOKEN
  });

  const users = await dynamo.listUsers();

  const weatherMessage = await build();

  const results = users.map(user => {
    const message: Message = {
      type: "message",
      source: {
        type: "user",
        userId: user.lineId
      },
      message: weatherMessage,
      timestamp: new Date().getTime()
    };
    return line.send(user.lineId, message);
  });

  try {
    await Promise.all(results);
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: e
      })
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "ok"
    })
  };
};
