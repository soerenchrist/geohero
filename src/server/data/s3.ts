import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_GEOHERO_REGION,
  credentials: {
    accessKeyId: process.env.GEOHERO_ACCESS_ID,
    secretAccessKey: process.env.GEOHERO_ACCESS_SECRET
  },
});