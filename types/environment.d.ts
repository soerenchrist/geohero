export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GEOHERO_ACCESS_ID: string;
      GEOHERO_ACCESS_SECRET: string;
      AWS_GEOHERO_REGION: string;
      DYNAMO_TABLE_NAME: string;
      S3_BUCKET_NAME: string;
    }
  }
}