/* eslint import/prefer-default-export: 0 */
import Cognito from "../../../../repository/cognito";
import Context, { Event, Result } from "../../../../context";

const { COGNITO_USER_POOL_ID } = process.env;

export const handler = async (event: Event): Promise<Result> => {
  const context = new Context(event);
  if (!context.isAdmin()) {
    return {
      statusCode: 401
    };
  }

  const afterGroups: string[] = JSON.parse(event.body);
  if (!afterGroups) {
    return {
      statusCode: 400
    };
  }

  try {
    const { userId } = event.pathParameters;
    const cognito = new Cognito({ userPoolId: COGNITO_USER_POOL_ID });

    const user = await cognito.getUser(userId);
    const beforeGroups = user.groups;
    const removed = beforeGroups
      .filter(group => !afterGroups.includes(group))
      .map(group => cognito.removeUserFromGroup(userId, group));
    const added = afterGroups
      .filter(group => !beforeGroups.includes(group))
      .map(group => cognito.addUserFromGroup(userId, group));
    await Promise.all(removed);
    await Promise.all(added);
    return {
      statusCode: 204
    };
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
};
