import { APIGatewayProxyEvent } from "aws-lambda";

export type Event = APIGatewayProxyEvent;
export type Result = {
  statusCode: number;
  headers?: {
    [header: string]: boolean | number | string;
  };
  multiValueHeaders?: {
    [header: string]: Array<boolean | number | string>;
  };
  body?: string;
  isBase64Encoded?: boolean;
};

export default class Context {
  private event: Event;

  constructor(event: Event) {
    this.event = event;
  }

  isAdmin(): boolean {
    const groups = this.event.requestContext.authorizer.claims[
      "cognito:groups"
    ];
    if (typeof groups === "string") {
      return groups.split(",").includes("Admin");
    }
    return groups.includes("Admin");
  }

  isOwn(): boolean {
    const { userId } = this.event.pathParameters;
    return userId === this.event.requestContext.authorizer.claims.sub;
  }
}
