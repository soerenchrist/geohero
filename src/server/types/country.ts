import { z } from "zod";

export const CountryDetailSchema = z.object({
  iso: z.string().min(2).max(2),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  name: z.string().min(1),
  nameInMainLanguage: z.string(),
  continent: z.enum(["Asia", "Europe", "North America", "South America", "Africa", "Oceania"]),
  currency: z.string(),
  languages: z.string().array(),
  population: z.number().min(0),
  populationDensity: z.number().min(0),
  area: z.number().min(0),
  biggestCity: z.string(),
  biggestCityPopulation: z.number().min(0)
});

export type CountryDetail = z.infer<typeof CountryDetailSchema>;

export const CountrySchema = CountryDetailSchema.pick({
  iso: true,
  latitude: true,
  longitude: true,
  name: true
});

export type Country = z.infer<typeof CountrySchema>;