/* eslint import/prefer-default-export: 0 */
import Message from "~/models/Message";
import LINE from "../../repository/line";
import DynamoDB from "../../repository/dynamodb";
import Cognito from "../../repository/cognito";
import Context, { Event, Result } from "../../context";

const {
  COGNITO_USER_POOL_ID,
  DYNAMODB_USERS_TABLE,
  DYNAMODB_MESSAGES_TABLE,
  LINE_CHANNELL_ACCESS_TOKEN
} = process.env;

export const handler = async (event: Event): Promise<Result> => {
  const context = new Context(event);
  if (!context.isAdmin()) {
    return {
      statusCode: 401
    };
  }

  const req = JSON.parse(event.body);
  if (!req.text) {
    return {
      statusCode: 400
    };
  }

  const dynamo = new DynamoDB({
    users: DYNAMODB_USERS_TABLE,
    messages: DYNAMODB_MESSAGES_TABLE
  });
  const line = new LINE(dynamo, {
    channelAccessToken: LINE_CHANNELL_ACCESS_TOKEN
  });

  if (req.groupName) {
    const cognito = new Cognito({ userPoolId: COGNITO_USER_POOL_ID });
    const users = await cognito.listUsersInGroup(req.groupName);
    const messages = users.map(user => {
      const { userId } = user.identities[0];
      const message: Message = {
        type: "message",
        source: {
          type: "user",
          userId
        },
        message: {
          type: "text",
          text: req.text
        },
        timestamp: new Date().getTime()
      };
      return line.send(userId, message);
    });
    try {
      await Promise.all(messages);
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: e
        })
      };
    }
  } else if (req.userId) {
    try {
      const user = await dynamo.getUser(req.userId);
      const message: Message = {
        type: "message",
        source: {
          type: "user",
          userId: user.lineId
        },
        message: {
          type: "text",
          text: req.text
        },
        timestamp: new Date().getTime()
      };
      await line.send(user.lineId, message);
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: e
        })
      };
    }
  } else {
    return {
      statusCode: 400
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "ok"
    })
  };
};
