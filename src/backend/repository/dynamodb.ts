import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuid } from "uuid";
import { PromiseResult } from "aws-sdk/lib/request";
import { AWSError } from "aws-sdk/lib/error";
import Message from "~/models/Message";

export default class DynamoDB {
  client: DocumentClient;

  private tableName: {
    users: string;
    messages: string;
  };

  constructor(tableName: { users: string; messages: string }) {
    this.tableName = tableName;
    this.client = new DocumentClient();
  }

  async getUser(userId: string): Promise<DocumentClient.AttributeMap> {
    const user = await this.client
      .get({
        TableName: this.tableName.users,
        Key: { id: userId }
      })
      .promise();
    return user.Item;
  }

  async listUsers(): Promise<DocumentClient.ItemList> {
    const users = await this.client
      .scan({
        TableName: this.tableName.users
      })
      .promise();
    return users.Items;
  }

  async getMessagesByUserId(userId: string): Promise<DocumentClient.ItemList> {
    const user = await this.client
      .get({
        TableName: this.tableName.users,
        Key: { id: userId }
      })
      .promise();
    const { lineId } = user.Item;
    const messages = await this.client
      .query({
        TableName: this.tableName.messages,
        IndexName: "sourceId-timestamp-index",
        KeyConditionExpression: "#pk = :pk",
        ExpressionAttributeNames: {
          "#pk": "sourceId"
        },
        ExpressionAttributeValues: {
          ":pk": lineId
        },
        ScanIndexForward: false
      })
      .promise();
    return messages.Items;
  }

  updateUser(user: {
    id: string;
    firstName: string;
    lastName: string;
    nickName: string;
  }): Promise<PromiseResult<DocumentClient.UpdateItemOutput, AWSError>> {
    return this.client
      .update({
        TableName: this.tableName.users,
        Key: {
          id: user.id
        },
        ExpressionAttributeValues: {
          ":lastName": user.lastName,
          ":firstName": user.firstName,
          ":nickName": user.nickName,
          ":updatedAt": new Date().getTime()
        },
        UpdateExpression:
          "set updatedAt = :updatedAt, lastName = :lastName, firstName = :firstName, nickName = :nickName"
      })
      .promise();
  }

  createMessage(
    message: Message,
    side: "receiver" | "sender"
  ): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> {
    let sourceId = message.source.userId;
    if (message.source.type === "group") {
      sourceId = message.source.groupId;
    } else if (message.source.type === "room") {
      sourceId = message.source.roomId;
    }
    return this.client
      .put({
        TableName: this.tableName.messages,
        Item: {
          id: uuid(),
          sourceId,
          side,
          ...message
        }
      })
      .promise();
  }
}
