import { LatLngExpression } from "leaflet";
import { useMemo } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { Country } from "../../server/types/country";
import {
  attribution,
  borderLayerUrl,
  layerUrl,
} from "../../utils/mapConstants";

const CountryMarker: React.FC<{ country: Country; found: boolean }> = ({
  country,
  found,
}) => {
  const position = useMemo<LatLngExpression>(
    () => [country.latitude, country.longitude],
    [country]
  );
  return (
    <Circle radius={70000} color={found ? "green" : "red"} center={position}>
      {found && <Tooltip>{country.name}</Tooltip>}
    </Circle>
  );
};

const WorldGuesserMap: React.FC<{
  guessedCountries: Country[];
  showCountryBorders: boolean;
  allCountries?: Country[] | null;
  showMissingCountries: boolean;
}> = ({
  guessedCountries,
  showCountryBorders,
  showMissingCountries,
  allCountries,
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
      {showCountryBorders && (
        <TileLayer
          attribution={attribution}
          url={borderLayerUrl}
          subdomains={["a", "b", "c", "d"]}
        />
      )}
      {guessedCountries.map((country) => (
        <CountryMarker key={country.index} found={true} country={country} />
      ))}
      {showMissingCountries &&
        allCountries?.map((country) => (
          <CountryMarker key={country.index} found={false} country={country} />
        ))}
    </MapContainer>
  );
};

export default WorldGuesserMap;
