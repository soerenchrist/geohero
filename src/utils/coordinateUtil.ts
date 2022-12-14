import { Country } from "../server/types/country";
import { getBlendedColor } from "./colorUtil";

export type GuessState = {
  distance: number;
  percentage: number;
  color: string;
  direction: Direction
}

export const checkGuess = (guess: Country, searched: Country) => {
  
  const distance = calculateDistance(
    guess.latitude,
    guess.longitude,
    searched.latitude,
    searched.longitude
  );
  const percentage = distanceToPercentage(distance);
  const color = getBlendedColor(percentage);
  const direction = directionTo(guess, searched);

  return {
    distance,
    percentage,
    color,
    direction
  }
}

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  var R = 6371 * 1000;
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

const toRad = (value: number) => {
  return (value * Math.PI) / 180;
};

export const distanceToPercentage = (distance: number) => {
  const minValue = 100000;
  const maxValue = 8000000;

  // calculate percentage -> the nearer the better
  var percentage = Math.round(
    ((maxValue - distance) / (maxValue - minValue)) * 100
  );
  if (percentage < 0) return 0;
  if (percentage > 100) return 100;
  return percentage;
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Direction =
  | "north"
  | "north-east"
  | "east"
  | "south-east"
  | "south"
  | "south-west"
  | "west"
  | "north-west"
  | "north";

export const directionTo = (startPoint: Coordinate, endPoint: Coordinate) => {
  const radians = Math.atan2(
    endPoint.longitude - startPoint.longitude,
    endPoint.latitude - startPoint.latitude
  );

  var compassReading = radians * (180 / Math.PI);

  var coordNames: Direction[] = [
    "north",
    "north-east",
    "east",
    "south-east",
    "south",
    "south-west",
    "west",
    "north-west",
    "north",
  ];
  var coordIndex = Math.round(compassReading / 45);
  if (coordIndex < 0) {
    coordIndex += 8;
  }

  return coordNames[coordIndex]!;
};
