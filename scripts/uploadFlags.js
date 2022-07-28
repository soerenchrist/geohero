const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");

const args = process.argv.slice(2);
if (args.length !== 4) {
  console.log("Please provide bucket name, region, access key id and secret");
  process.exit(-1);
}

const [bucketName, region, accessKey, secret] = args;

const client = new S3Client({
  region,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secret,
  },
});

const upload = async () => {
  const files = fs.readdirSync("./flags");
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filename = path.join("./flags", file);
    
    const blob = fs.readFileSync(filename);
    const putItemCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: `flags/${file}`,
      Body: blob,
    });

    await client.send(putItemCommand);
  }
};

upload().then(() => console.log("finished"));
