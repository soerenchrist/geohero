import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import {
  getCountryByIndex,
  getCountryByName,
  registerChallengeToken,
  ChallengeTokenSchema,
  UserResultSchema,
  saveUserResult,
  getLeaderboard,
  getAllCountries,
} from "../data/dynamo";
import { s3Client } from "../data/s3";
import { createRouter } from "./context";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";
import { Country } from "../types/country";

export const gameRouter = createRouter()
  .query("get-country-by-index", {
    input: z.object({
      index: z.number().min(0).max(198),
    }),
    async resolve({ input }) {
      const country = await getCountryByIndex(input.index);
      return country;
    },
  })
  .query("get-all-countries", {
    async resolve() {
      return await getAllCountries();
    }
  })
  .query("check-country-by-name", {
    input: z.object({
      name: z.string().min(4),
    }),
    async resolve({ input }) {
      const country = await getCountryByName(input.name);
      return country;
    },
  })
  .query("get-country-shape-url", {
    input: z.object({
      iso: z.string(),
    }),
    async resolve({ input }) {
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
    },
  })
  .query("get-country-flag-url", {
    input: z.object({
      iso: z.string(),
    }),
    async resolve({ input }) {
      const key = `flags/${input.iso.toLowerCase()}.svg`;

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      };

      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });
      return url;
    },
  })
  .query("get-game-token", {
    async resolve() {
      const id = nanoid(10);
      return {
        token: id,
      };
    },
  })
  .query("get-leader-board", {
    input: z.object({
      challenge: z.string(),
      orderDesc: z.boolean(),
    }),
    async resolve({ input }) {
      const board = await getLeaderboard(input.challenge, input.orderDesc);

      return board;
    },
  })
  .mutation("register-token", {
    input: ChallengeTokenSchema,
    async resolve({ input }) {
      await registerChallengeToken(input);
      return input.token;
    },
  })
  .mutation("save-user-result", {
    input: UserResultSchema.omit({
      userToken: true,
    }),
    async resolve({ ctx, input }) {
      if (!ctx.userToken) throw new TRPCError({ code: "FORBIDDEN" });
      await saveUserResult({
        ...input,
        userToken: ctx.userToken,
      });
    },
  });
