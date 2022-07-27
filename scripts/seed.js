const countries = require("./countries.json");
const aws = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const args = process.argv.slice(2);
if (args.length !== 4) {
  console.log("Please provide table name, region, access key id and secret");
  process.exit(-1);
}

const [tableName, region, accessKeyId, accessKeySecret] = args;

const client = new aws.DynamoDB({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: accessKeySecret,
  },
});
const documentClient = DynamoDBDocument.from(client);

countries.forEach((item, index) => (item.index = index));

for (let i = 0; i < countries.length; i++) {
  const country = countries[i];
  const item = {
    ...country,
    pk: "COUNTRY",
    sk: country.iso,
    gsi1pk: "COUNTRY",
    gsi1sk: country.index + "",
  };

  documentClient
    .put({
      Item: item,
      TableName: tableName,
    })
    .then((result) => {
      console.log(`${country.iso} succeeded`);
    })
    .catch((err) => {
      console.log(err);
      console.log(`${country.iso} failed`);
    });
}
