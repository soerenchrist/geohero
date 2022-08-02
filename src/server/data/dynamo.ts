import * as AWS from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { CountrySchema } from "../types/country";
import {
  CountrySearchSettingsSchema,
  WorldGuesserSettingsSchema,
} from "../types/settings";

const client = new AWS.DynamoDB({
  region: process.env.AWS_GEOHERO_REGION,
  credentials: {
    accessKeyId: process.env.GEOHERO_ACCESS_ID,
    secretAccessKey: process.env.GEOHERO_ACCESS_SECRET,
  },
});
const documentClient = DynamoDBDocument.from(client);

export const getCountryByIndex = async (index: number) => {
  const result = await documentClient.query({
    TableName: process.env.DYNAMO_TABLE_NAME,
    IndexName: "gsi1",
    KeyConditionExpression: "gsi1pk = :pk AND gsi1sk = :sk",
    ExpressionAttributeValues: {
      ":pk": "COUNTRY",
      ":sk": index + "",
    },
  });

  if (result.Items?.length !== 1) return null;
  const country = CountrySchema.parse(result.Items[0]);
  return country;
};

export const getCountryByName = async (name: string) => {
  const result = await documentClient.get({
    TableName: process.env.DYNAMO_TABLE_NAME,
    Key: {
      pk: "COUNTRY",
      sk: name,
    },
  });

  if (result.Item) {
    return CountrySchema.parse(result.Item);
  }

  return null;
};

export const ChallengeTokenSchema = z.object({
  token: z.string().min(5),
  game: z.enum(["world-guesser", "country-search"]),
  settings: z.union([WorldGuesserSettingsSchema, CountrySearchSettingsSchema]),
});

export type RegisterToken = z.infer<typeof ChallengeTokenSchema>;

export const registerChallengeToken = async (data: RegisterToken) => {
  const item = {
    pk: "CHALLENGE",
    sk: data.token,
    ...data,
  };
  await documentClient.put({
    TableName: process.env.DYNAMO_TABLE_NAME,
    Item: item,
  });
};

export const getChallengeTokenSettings = async (token: string) => {
  const result = await documentClient.get({
    TableName: process.env.DYNAMO_TABLE_NAME,
    Key: {
      pk: "CHALLENGE",
      sk: token,
    },
  });

  if (result.Item) {
    return ChallengeTokenSchema.parse(result.Item);
  }

  return null;
};

export const UserResultSchema = z.object({
  userToken: z.string(),
  challengeToken: z.string(),
  timeInMillis: z.number().min(0),
  guesses: z.number().min(0),
  date: z.string(),
  name: z.string().optional(),
  timeDetails: z.map(z.string(), z.number()).optional(),
});
export type UserResult = z.infer<typeof UserResultSchema>;

// dynamodb automatically sorts by sort key
// make sure to have a key that sorts alphabetically
const createSortableKey = (time: number) => {
  const sortString = time.toString();
  return sortString.padStart(10, "0");
};

export const saveUserResult = async (result: UserResult) => {
  const sortableKey = createSortableKey(result.timeInMillis);
  const item = {
    pk: "CHALLENGE#" + result.challengeToken,
    sk: `USER#${result.userToken}`,
    gsi1pk: "CHALLENGE#" + result.challengeToken,
    gsi1sk: `USER#${sortableKey}#${result.userToken}`,
    ...result,
  };

  await documentClient.put({
    TableName: process.env.DYNAMO_TABLE_NAME,
    Item: item,
  });
};

export const getUserResult = async (challenge: string, user: string) => {
  const result = await documentClient.get({
    Key: {
      pk: "CHALLENGE#" + challenge,
      sk: "USER#" + user,
    },
    TableName: process.env.DYNAMO_TABLE_NAME,
  });

  if (result.Item) return UserResultSchema.parse(result.Item);

  return null;
};

export const getLeaderboard = async (challenge: string) => {
  const result = await documentClient.query({
    KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
    IndexName: "gsi1",
    TableName: process.env.DYNAMO_TABLE_NAME,
    ExpressionAttributeNames: {
      "#pk": "gsi1pk",
      "#sk": "gsi1sk",
    },
    ExpressionAttributeValues: {
      ":pk": `CHALLENGE#${challenge}`,
      ":sk": `USER#`,
    },
    Limit: 5,
  });

  const results: UserResult[] = [];
  if (!result.Items) return results;

  result.Items.forEach((x) => results.push(UserResultSchema.parse(x)));

  return results;
};
