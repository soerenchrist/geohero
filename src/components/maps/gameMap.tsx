import { useEffect } from "react";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";
import { type GeoJson } from "../../server/types/geojson";
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

const GameMap: React.FC<{ geojson?: GeoJson; center: Coordinate }> = ({
  geojson,
  center,
}) => {
  return (
    <MapContainer
      className="h-96 z-0"
      center={{ lat: 49, lng: 10 }}
      zoom={5}
      scrollWheelZoom={true}
    >
      <TileLayer attribution={attribution} url={layerUrl} />
      {geojson && <GeoJSON key={geojson.properties.ISO_A2} data={geojson} />}
      <PositionHandler center={center} />
    </MapContainer>
  );
};

export default GameMap;
