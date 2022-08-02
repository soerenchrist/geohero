import { LatLngExpression } from "leaflet";
import { useMemo } from "react";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import { Country } from "../../server/types/country";
import {
  attribution,
  borderLayerUrl,
  layerUrl,
} from "../../utils/mapConstants";
import { blueMarker } from "./customMarkers";

const marker = blueMarker;

const CountryMarker: React.FC<{ country: Country }> = ({ country }) => {
  const position = useMemo<LatLngExpression>(
    () => [country.latitude, country.longitude],
    [country]
  );
  return (
    <Marker icon={marker} position={position}>
      <Tooltip>{country.name}</Tooltip>
    </Marker>
  );
};

const WorldGuesserMap: React.FC<{ guessedCountries: Country[] }> = ({
  guessedCountries,
}) => {
  return (
    <MapContainer
      className="h-144 z-0"
      center={{ lat: 49, lng: 10 }}
      zoom={3}
      scrollWheelZoom={true}
      zoomControl={true}
      doubleClickZoom={false}
    >
      <TileLayer attribution={attribution} url={layerUrl} />
      <TileLayer
        attribution={attribution}
        url={borderLayerUrl}
        subdomains={["a", "b", "c", "d"]}
      />

      {guessedCountries.map((country) => (
        <CountryMarker key={country.index} country={country} />
      ))}
    </MapContainer>
  );
};

export default WorldGuesserMap;
