import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import Container from "../../components/common/container";
import CountrySearchField from "../../components/game/countrySearchField";
import { Country } from "../../server/types/country";
import { type GeoJson } from "../../server/types/geojson";
import { generateDistinctNumbers } from "../../utils/randomUtil";
import { trpc } from "../../utils/trpc";

const Map = dynamic(() => import("../../components/maps/gameMap"), {
  ssr: false,
});

const useCountryData = (countryIndex?: number) => {
  const [shapeData, setShapeData] = useState<GeoJson>();
  const { data: country, isLoading: dataLoading } = trpc.useQuery([
    "game.get-country-by-index",
    {
      index: countryIndex ?? 0,
    },
  ], {
    enabled: countryIndex != null
  });
  const { data: shapeUrl, isLoading: shapeLoading } = trpc.useQuery(
    [
      "game.get-country-shape-url",
      {
        iso: country?.iso ?? "",
      },
    ],
    {
      enabled: country != null,
    }
  );

  const isLoading = useMemo(
    () => dataLoading || shapeLoading,
    [dataLoading, shapeLoading]
  );

  useEffect(() => {
    const fetchGeoJson = async (url: string) => {
      const response = await fetch(url);
      setShapeData(await response.json());
    };
    if (shapeUrl) {
      fetchGeoJson(shapeUrl);
    }
  }, [shapeUrl]);

  return { shapeData, country, isLoading };
};

const GamePage: NextPage<{ countryIndices: number[]; rounds: number }> = ({
  countryIndices,
  rounds,
}) => {
  const [currentGuess, setCurrentGuess] = useState<Country>();
  const [currentRound, setCurrentRound] = useState(0);
  const currentCountryIndex = useMemo(
    () => countryIndices[currentRound]!,
    [countryIndices, currentRound]
  );

  const { country, shapeData, isLoading } = useCountryData(currentGuess?.index);
  return (
    <Container>
      <div className="flex flex-col w-screen h-screen items-center gap-8">
        <div className="h-1/2 w-full">
          <Map
            center={country ?? { latitude: 49, longitude: 10 }}
            geojson={shapeData}
          />
        </div>
        <CountrySearchField onCountryInput={setCurrentGuess} />
      </div>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let rounds = 5;
  const roundsString = ctx.query.rounds;
  if (roundsString && typeof roundsString === "string") {
    const value = parseInt(roundsString);
    if (!isNaN(value)) rounds = value;
  }

  const countryIndices = generateDistinctNumbers(rounds, 0, 198);
  return {
    props: {
      countryIndices,
      rounds,
    },
  };
};

export default GamePage;
