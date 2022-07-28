import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { getCountryByIndex } from "../data/dynamo";
import { s3Client } from "../data/s3";
import { createRouter } from "./context";

export const gameRouter = createRouter()
  .query("get-country-by-index", {
    input: z.object({
      index: z.number().min(0).max(198)
    }),
    async resolve({ input }) {
      const country = getCountryByIndex(input.index);
      return country;
    }
  })
  .query("get-country-shape-url", {
    input: z.object({
      iso: z.string()
    }),
    async resolve({ input }){
      const key = `shapes/${input.iso}.geojson`;
      
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      };

      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });
      return url;
    }
  })