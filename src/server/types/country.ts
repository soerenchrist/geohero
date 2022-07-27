export type CountryDetail = {
  iso: string;
  latitude: number;
  longitude: number;
  name: string;
  nameInMainLang: string;
  continent: string;
  currency: string;
  languages: string[];
  population: number;
  populationDensity: number;
  area: number;
  biggestCity: string;
  biggestCityPopulation: number;
};

export type Country = Pick<
  CountryDetail,
  "iso" | "latitude" | "longitude" | "name"
>;
