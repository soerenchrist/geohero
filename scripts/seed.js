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

async function insertItems(countries) {

  var size = 10; var chunks = [];
  for (var i = 0; i < countries.length; i += size) {
    chunks.push(countries.slice(i, i + size));
  }
  for (let c = 0; c < chunks.length; c++) {
    const chunk = chunks[c];
    const transactionItems = []
    for (let i = 0; i < chunk.length; i++) {
      const country = chunk[i];
      const item = {
        ...country,
        pk: "COUNTRY",
        sk: country.name,
        gsi1pk: "COUNTRY",
        gsi1sk: country.index + "",
      };
      transactionItems.push({
        Put: {
          Item: item,
          TableName: tableName,
        }
      });
    }
    await documentClient.transactWrite({
      TransactItems: transactionItems
    })
    console.log("Inserted chunk")
  }
}

insertItems(countries).then(() => console.log("finished"));