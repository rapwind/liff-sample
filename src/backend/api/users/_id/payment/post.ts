/* eslint import/prefer-default-export: 0 */
import Stripe from "stripe";
import DynamoDB from "../../../../repository/dynamodb";
import Context, { Event, Result } from "../../../../context";

const {
  DYNAMODB_USERS_TABLE,
  DYNAMODB_MESSAGES_TABLE,
  STRIPE_SECRET_KEY
} = process.env;

export const handler = async (event: Event): Promise<Result> => {
  const context = new Context(event);

  if (!context.isOwn()) {
    return {
      statusCode: 401
    };
  }

  try {
    const { userId } = event.pathParameters;
    const dynamo = new DynamoDB({
      users: DYNAMODB_USERS_TABLE,
      messages: DYNAMODB_MESSAGES_TABLE
    });
    const user = await dynamo.getUser(userId);
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2020-03-02"
    });
    const cards = await stripe.customers.listSources(user.stripeId, {
      object: "card"
    });
    if (cards.data.length === 0) {
      return {
        statusCode: 400
      };
    }
    await stripe.charges.create({
      amount: 100,
      currency: "jpy",
      description: "test",
      customer: user.stripeId,
      source: cards.data[0].id
    });
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }

  return {
    statusCode: 201
  };
};
