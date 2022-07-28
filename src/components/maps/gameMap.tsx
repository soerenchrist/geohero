import { useEffect, useState } from "react";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";
import { type GeoJson } from "../../server/types/geojson";
import { getBlendedColor } from "../../utils/colorUtil";
import { distanceToPercentage } from "../../utils/coordinateUtil";
import { attribution, layerUrl } from "../../utils/mapConstants";

type Coordinate = {
  latitude: number;
  longitude: number;
};

const PositionHandler: React.FC<{ center: Coordinate }> = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo({ lat: center.latitude, lng: center.longitude }, map.getZoom());
  }, [center, map]);

  return <></>;
};

const GameMap: React.FC<{
  geojson?: GeoJson;
  center: Coordinate;
  distance?: number;
}> = ({ geojson, center, distance }) => {
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
      className="h-96 z-0"
      center={{ lat: 49, lng: 10 }}
      zoom={5}
      scrollWheelZoom={false}
      zoomControl={false}
      doubleClickZoom={false}
    >
      <TileLayer attribution={attribution} url={layerUrl} />
      {geojson && (
        <GeoJSON
          style={{ color }}
          key={geojson.properties.ISO_A2}
          data={geojson}
        />
      )}
      <PositionHandler center={center} />
    </MapContainer>
  );
};

export default GameMap;
