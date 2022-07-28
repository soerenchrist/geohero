import * as AWS from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { CountrySchema } from "../types/country";

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
