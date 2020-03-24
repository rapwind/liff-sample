import { Message as MessageTypes } from "@line/bot-sdk";

export default interface Message {
  id?: string;
  sourceId?: string;
  timestamp: number;
  type: "message";
  mode?: string;
  replyToken?: string;
  source: UserSource | GroupSource | RoomSource;
  message: MessageTypes;
}

interface UserSource {
  type: "user";
  userId: string;
}

interface GroupSource {
  type: "group";
  userId: string;
  groupId: string;
}

interface RoomSource {
  type: "room";
  userId: string;
  roomId: string;
}
