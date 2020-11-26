import * as CognitoIdentityServiceProvider from "aws-sdk/clients/cognitoidentityserviceprovider";
import { PromiseResult } from "aws-sdk/lib/request";
import { Response } from "aws-sdk/lib/response";
import { AWSError } from "aws-sdk/lib/error";

interface UserPoolType {
  id?: string;
  email?: string;
  lineName?: string;
  profilePictureUrl?: string;
  identities?: { userId: string }[];
  groups?: string[];
}

export default class Cognito {
  provider: CognitoIdentityServiceProvider;

  userPoolId: string;

  constructor(params: { userPoolId: string }) {
    this.provider = new CognitoIdentityServiceProvider();
    this.userPoolId = params.userPoolId;
  }

  getCognitoFed() {
    return this.provider.listIdentityProviders({
      UserPoolId: this.userPoolId
    }).promise();
  }

  private async getUserWithoutGroup(
    userId: string
  ): Promise<CognitoIdentityServiceProvider.UserType> {
    const res = await this.provider
      .listUsers({
        UserPoolId: this.userPoolId,
        Filter: `sub = "${userId}"`
      })
      .promise();
    if (res.Users.length !== 1) {
      return null;
    }
    return res.Users[0];
  }

  async getUser(userId: string): Promise<UserPoolType> {
    const user = await this.getUserWithoutGroup(userId);
    if (!user) {
      return null;
    }
    const cognitoGroups = await this.provider
      .adminListGroupsForUser({
        UserPoolId: this.userPoolId,
        Username: user.Username
      })
      .promise();
    const groups = cognitoGroups.Groups.map(group => group.GroupName).filter(
      group => !group.includes(this.userPoolId)
    );
    return {
      id: userId,
      email: user.Attributes.find(v => v.Name === "email").Value, // TODO: Fix optional
      lineName: user.Attributes.find(v => v.Name === "name").Value, // TODO: Fix optional
      profilePictureUrl: user.Attributes.find(v => v.Name === "picture").Value, // TODO: Fix optional
      identities: JSON.parse(
        user.Attributes.find(e => e.Name === "identities").Value
      ),
      groups
    };
  }

  async listUsersInGroup(groupName: string): Promise<UserPoolType[]> {
    const { Users } = await this.provider
      .listUsersInGroup({
        UserPoolId: this.userPoolId,
        GroupName: groupName
      })
      .promise();
    return Users.map(user => ({
      id: user.Attributes.find(v => v.Name === "sub").Value,
      email: user.Attributes.find(v => v.Name === "email").Value, // TODO: Fix optional
      lineName: user.Attributes.find(v => v.Name === "name").Value, // TODO: Fix optional
      profilePictureUrl: user.Attributes.find(v => v.Name === "picture").Value, // TODO: Fix optional
      identities: JSON.parse(
        user.Attributes.find(e => e.Name === "identities").Value
      )
    }));
  }

  createGroup(
    groupName: string
  ): Promise<
    PromiseResult<CognitoIdentityServiceProvider.CreateGroupResponse, AWSError>
  > {
    return this.provider
      .createGroup({
        UserPoolId: this.userPoolId,
        GroupName: groupName
      })
      .promise();
  }

  deleteGroup(
    groupName: string
  ): Promise<{
    $response: Response<{}, AWSError>;
  }> {
    return this.provider
      .deleteGroup({
        UserPoolId: this.userPoolId,
        GroupName: groupName
      })
      .promise();
  }

  async listGroups(): Promise<string[]> {
    const { Groups } = await this.provider
      .listGroups({
        UserPoolId: this.userPoolId
      })
      .promise();
    return Groups.map(group => group.GroupName).filter(
      group => !group.includes(this.userPoolId)
    );
  }

  async addUserFromGroup(
    userId: string,
    groupName: string
  ): Promise<{
    $response: Response<{}, AWSError>;
  }> {
    const user = await this.getUserWithoutGroup(userId);
    if (!user) {
      return null;
    }
    return this.provider
      .adminAddUserToGroup({
        UserPoolId: this.userPoolId,
        Username: user.Username,
        GroupName: groupName
      })
      .promise();
  }

  async removeUserFromGroup(
    userId: string,
    groupName: string
  ): Promise<{
    $response: Response<{}, AWSError>;
  }> {
    const user = await this.getUserWithoutGroup(userId);
    if (!user) {
      return null;
    }
    return this.provider
      .adminRemoveUserFromGroup({
        UserPoolId: this.userPoolId,
        Username: user.Username,
        GroupName: groupName
      })
      .promise();
  }
}
