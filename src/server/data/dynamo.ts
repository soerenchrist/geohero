import * as AWS from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { CountryDetail } from "../types/country";

const client = new AWS.DynamoDB({
  region: process.env.DYNAMO_REGION,
  credentials: {
    accessKeyId: process.env.DYNAMO_ACCESS_ID,
    secretAccessKey: process.env.DYNAMO_ACCESS_SECRET,
  },
});
const documentClient = DynamoDBDocument.from(client);

const randomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomCountry = async () => {
  const count = 198;
  const randomNumber = randomInteger(0, count);
  const result = await documentClient.query({
    TableName: process.env.DYNAMO_TABLE_NAME,
    IndexName: "gsi1",
    KeyConditionExpression: "gsi1pk = :pk AND gsi1sk = :sk",
    ExpressionAttributeValues: {
      ":pk": "COUNTRY",
      ":sk": randomNumber + ""
    }
  });

  if (result.Items?.length !== 1) return null;
  return result.Items[0] as CountryDetail;
};
