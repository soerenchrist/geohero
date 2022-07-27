import { z } from "zod";
import { getCountryByIndex } from "../data/dynamo";
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