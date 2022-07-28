type Coordinate = [number, number];

export type GeoJson = {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: Coordinate[] | Coordinate[][];
  };
  properties: {
    ISO_A3?: string;
    ISO_A2: string;
  };
};
