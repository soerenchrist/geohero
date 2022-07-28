import { useEffect, useMemo, useState } from "react";
import {
  GeoJSON,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { type GeoJson } from "../../server/types/geojson";
import { getBlendedColor } from "../../utils/colorUtil";
import { Direction, distanceToPercentage } from "../../utils/coordinateUtil";
import {
  attribution,
  borderLayerUrl,
  layerUrl,
} from "../../utils/mapConstants";
import EastIcon from "../icons/east";
import NorthIcon from "../icons/north";
import UpIcon from "../icons/north";
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

const DirectionIcon = ({ direction }: { direction: Direction }) => {
  const classes = "w-7 h-7";

  const icon = useMemo(() => {
    switch (direction) {
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
  }, [direction]);

  return icon;
};

const GameMap: React.FC<{
  geojson?: GeoJson;
  center: Coordinate;
  distance?: number;
  direction?: Direction;
  showBorders: boolean;
}> = ({ geojson, center, distance, direction, showBorders }) => {
  const [color, setColor] = useState("#0000ff");
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!distance) return;
    const perc = distanceToPercentage(distance);
    setPercentage(perc);

    const col = getBlendedColor(perc);
    console.log(col);
    setColor(col);
  }, [distance]);

  return (
    <MapContainer
      className="h-96 lg:h-full z-0"
      center={{ lat: 49, lng: 10 }}
      zoom={5}
      scrollWheelZoom={false}
      zoomControl={false}
      doubleClickZoom={false}
    >
      <TileLayer attribution={attribution} url={layerUrl} />
      {showBorders && (
        <TileLayer
          attribution={attribution}
          url={borderLayerUrl}
          subdomains={["a", "b", "c", "d"]}
        />
      )}
      {geojson && (
        <GeoJSON
          style={{ color }}
          key={geojson.properties.ISO_A2}
          data={geojson}
        >
          {direction && (
            <Tooltip
              permanent
              position={{ lat: center.latitude, lng: center.longitude }}
            >
              <DirectionIcon direction={direction} />
            </Tooltip>
          )}
        </GeoJSON>
      )}
      <PositionHandler center={center} />
    </MapContainer>
  );
};

export default GameMap;
