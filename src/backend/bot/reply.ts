/* eslint import/prefer-default-export: 0 */
import DynamoDB from "../repository/dynamodb";
import LINE, { Response as LINEEventResponse } from "../repository/line";
import { Event, Result } from "../context";

const {
  LINE_CHANNELL_ACCESS_TOKEN,
  DYNAMODB_USERS_TABLE,
  DYNAMODB_MESSAGES_TABLE
} = process.env;

export const handler = async (event: Event): Promise<Result> => {
  const { events } = JSON.parse(event.body);
  const dynamo = new DynamoDB({
    users: DYNAMODB_USERS_TABLE,
    messages: DYNAMODB_MESSAGES_TABLE
  });
  const line = new LINE(dynamo, {
    channelAccessToken: LINE_CHANNELL_ACCESS_TOKEN
  });
  const results = events.map(
    (ev): Promise<LINEEventResponse> => {
      if (
        ev.replyToken !== "00000000000000000000000000000000" &&
        ev.replyToken !== "ffffffffffffffffffffffffffffffff"
      ) {
        // const msg = {
        //   type: "message",
        //   source: {
        //     ...ev.source
        //   },
        //   message: {
        //     type: "text",
        //     text: "じどうおうとう"
        //   },
        //   timestamp: new Date().getTime()
        // };
        return line.reply(ev);
      }
      return Promise.resolve();
    }
  );
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
    headers: { "X-Line-Status": "OK" },
    body: JSON.stringify({
      result: "completed"
    })
  };
};
