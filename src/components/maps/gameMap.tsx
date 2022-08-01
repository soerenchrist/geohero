import { useEffect, useMemo, useState } from "react";
import {
  GeoJSON,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { type GameSettings } from "../../pages/game";
import { type GeoJson } from "../../server/types/geojson";
import { Direction, type GuessState } from "../../utils/coordinateUtil";
import {
  attribution,
  borderLayerUrl,
  layerUrl,
} from "../../utils/mapConstants";
import CheckIcon from "../icons/check";
import EastIcon from "../icons/east";
import NorthIcon from "../icons/north";
import NorthEastIcon from "../icons/northEast";
import NorthWestIcon from "../icons/northWest";
import SouthIcon from "../icons/south";
import SouthEastIcon from "../icons/southEast";
import SouthWestIcon from "../icons/southWest";
import WestIcon from "../icons/west";

type Coordinate = {
  latitude: number;
  longitude: number;
};

const PositionHandler: React.FC<{ center: Coordinate }> = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo({ lat: center.latitude, lng: center.longitude }, 4);
  }, [center, map]);

  return <></>;
};

const DirectionIcon = ({ guessState }: { guessState: GuessState }) => {
  const classes = "w-7 h-7";

  const icon = useMemo(() => {
    if (guessState.distance === 0) {
      return <CheckIcon className={classes}></CheckIcon>;
    }
    switch (guessState.direction) {
      case "east":
        return <EastIcon className={classes} />;
      case "north":
        return <NorthIcon className={classes} />;
      case "south":
        return <SouthIcon className={classes} />;
      case "west":
        return <WestIcon className={classes} />;
      case "north-east":
        return <NorthEastIcon className={classes} />;
      case "north-west":
        return <NorthWestIcon className={classes} />;
      case "south-east":
        return <SouthEastIcon className={classes} />;
      case "south-west":
        return <SouthWestIcon className={classes} />;
    }
  }, [guessState]);

  return icon;
};

const GameMap: React.FC<{
  geojson?: GeoJson;
  center: Coordinate;
  guessState?: GuessState;
  settings: GameSettings;
}> = ({ geojson, center, guessState, settings }) => {
  return (
    <MapContainer
      className="h-72 lg:h-full z-0"
      center={{ lat: 49, lng: 10 }}
      zoom={5}
      scrollWheelZoom={false}
      zoomControl={false}
      doubleClickZoom={false}
    >
      <TileLayer attribution={attribution} url={layerUrl} />
      {settings.showBorders && (
        <TileLayer
          attribution={attribution}
          url={borderLayerUrl}
          subdomains={["a", "b", "c", "d"]}
        />
      )}
      {geojson && (
        <GeoJSON
          style={{ color: guessState?.color, fillOpacity: 0.6 }}
          key={geojson.properties.ISO_A2}
          data={geojson}
        >
          {((guessState?.direction && settings.showDirection) ||
            settings.showPercentage) && (
            <Tooltip
              permanent
              position={{ lat: center.latitude, lng: center.longitude }}
            >
              <div className="flex gap-2 items-center">
                {settings.showPercentage && guessState && (
                  <span className="text-lg">
                    {Math.round(guessState.percentage)} %
                  </span>
                )}
                {guessState && (
                  <DirectionIcon guessState={guessState} />
                )}
              </div>
            </Tooltip>
          )}
        </GeoJSON>
      )}
      <PositionHandler center={center} />
    </MapContainer>
  );
};

export default GameMap;
