import { Client } from "@line/bot-sdk";
import Message from "~/models/Message";
import DynamoDB from "./dynamodb";

export type Response = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export default class LINE {
  client: Client;
  dynamo: DynamoDB;

  constructor(dynamo: DynamoDB, params: { channelAccessToken: string }) {
    this.client = new Client(params);
    this.dynamo = dynamo;
  }

  reply(event: Message, message?: Message): Promise<Response> {
    if (message) {
      return Promise.all([
        this.dynamo.createMessage(event, "receiver"),
        this.client.replyMessage(event.replyToken, message.message),
        this.dynamo.createMessage(message, "sender")
      ]);
    }
    return this.dynamo.createMessage(event, "receiver");
  }

  send(userId: string, message: Message): Promise<Response> {
    return Promise.all([
      this.client.pushMessage(userId, message.message),
      this.dynamo.createMessage(message, "sender")
    ]);
  }
}
