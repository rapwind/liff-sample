/* eslint import/prefer-default-export: 0 */
import { Client, TextMessage } from "@line/bot-sdk";
import * as DynamoDB from "aws-sdk/clients/dynamodb";
import Stripe from "stripe";

const {
  DYNAMODB_USERS_TABLE,
  STRIPE_SECRET_KEY,
  LINE_CHANNELL_ACCESS_TOKEN
} = process.env;

type Result = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const handler = async (event): Promise<Result> => {
  if (event.triggerSource !== "PostConfirmation_ConfirmSignUp") {
    return event;
  }

  const userId = event.request.userAttributes.sub;
  const { identities, name } = event.request.userAttributes;
  const lineId = JSON.parse(identities)[0].userId;

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2020-03-02"
    });
    const customer: Stripe.Customer = await stripe.customers.create({
      description: userId,
      metadata: { userId }
    });
    await new DynamoDB.DocumentClient()
      .update({
        TableName: DYNAMODB_USERS_TABLE,
        Key: {
          id: event.request.userAttributes.sub
        },
        ExpressionAttributeValues: {
          ":nickName": name,
          ":lineId": lineId,
          ":stripeId": customer.id,
          ":createdAt": new Date().getTime(),
          ":updatedAt": new Date().getTime()
        },
        UpdateExpression: `set ${[
          "nickName",
          "lineId",
          "stripeId",
          "createdAt",
          "updatedAt"
        ]
          .map(e => `${e}=:${e}`)
          .join(",")}`
      })
      .promise();
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
    return event;
  }

  const config = {
    channelAccessToken: LINE_CHANNELL_ACCESS_TOKEN
  };
  const client = new Client(config);

  const msg: TextMessage = {
    type: "text",
    text: `登録ありがとうございます。あなたのユーザーIDは「${lineId}」です。`
  };

  try {
    await client.pushMessage(lineId, msg);
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }
  return event;
};
