import { createRouter } from "./context";
import { z } from "zod";
import { getRandomCountry } from "../data/dynamo";

export const exampleRouter = createRouter().query("hello", {
  input: z
    .object({
      text: z.string().nullish(),
    })
    .nullish(),
  async resolve() {
    const result = await getRandomCountry();
    return {
      greeting: `Hello ${result?.name ?? "world"}`,
    };
  },
});
