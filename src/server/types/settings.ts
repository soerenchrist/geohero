import { z } from "zod";

export const WorldGuesserSettingsSchema = z.object({
  time: z.number().min(1).max(10),
  showCountryBorders: z.boolean(),
  showMissingCountries: z.boolean(),
});
export const CountrySearchSettingsSchema = z.object({
  rounds: z.number().min(3).max(10),
  showCountryBorders: z.boolean(),
  showDirections: z.boolean(),
  showPercentage: z.boolean(),
  countryIndices: z.number().array()
});

export type CountrySearchSettings = z.infer<typeof CountrySearchSettingsSchema>
