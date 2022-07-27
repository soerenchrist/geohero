export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DYNAMO_ACCESS_ID: string;
      DYNAMO_ACCESS_SECRET: string;
      DYNAMO_REGION: string;
      DYNAMO_TABLE_NAME: string;
    }
  }
}