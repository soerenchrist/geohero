import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/common/button";
import Container from "../../components/common/container";
import Meta from "../../components/common/meta";
import CorrectCountriesDisplay from "../../components/game/correctCountriesDisplay";
import CountrySearchField from "../../components/game/countrySearchField";
import SettingsIcon from "../../components/icons/settings";
import { getChallengeTokenSettings } from "../../server/data/dynamo";
import { Country } from "../../server/types/country";
import { type GeoJson } from "../../server/types/geojson";
import {
  checkGuess,
  type GuessState,
} from "../../utils/coordinateUtil";
import { generateDistinctNumbers } from "../../utils/randomUtil";
import { trpc } from "../../utils/trpc";

const Map = dynamic(() => import("../../components/maps/gameMap"), {
  ssr: false,
});

const useTimer = () => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTime = useRef<Date>();
  const timer = useRef<NodeJS.Timer>();

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  }, []);

  useEffect(() => {
    startTime.current = new Date();
    timer.current = setInterval(
      () =>
        setElapsedSeconds(
          Math.floor(
            (new Date().getTime() - startTime.current!.getTime()) / 1000
          )
        ),
      500
    );

    return () => {
      clearInterval(timer.current);
    };
  }, []);

  return { elapsedSeconds, stop };
};

const useCountryShape = (iso?: string) => {
  const [shapeData, setShapeData] = useState<GeoJson>();
  const { data: shapeUrl, isLoading: shapeLoading } = trpc.useQuery(
    [
      "game.get-country-shape-url",
      {
        iso: iso ?? "",
      },
    ],
    {
      enabled: iso != null,
      refetchOnWindowFocus: false,
    }
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
  return { shapeData, shapeLoading };
};

const useCountryData = (countryIndex?: number) => {
  return trpc.useQuery(
    [
      "game.get-country-by-index",
      {
        index: countryIndex ?? 0,
      },
    ],
    {
      enabled: countryIndex != null,
      refetchOnWindowFocus: false,
      onSuccess(data) {
        console.log(data);
      },
    }
  );
};

export type GameSettings = {
  rounds: number;
  showDirection: boolean;
  showBorders: boolean;
  showPercentage: boolean;
};

const GamePage: NextPage<{
  countryIndices: number[];
  settings: GameSettings;
}> = ({ countryIndices, settings }) => {
  const [gameWon, setGameWon] = useState(false);
  const [correctGuesses, setCorrectGuesses] = useState<Country[]>([]);
  const [showCorrectMessage, setShowCorrectMessage] = useState(false);
  const [currentGuess, setCurrentGuess] = useState<Country>();
  const [currentRound, setCurrentRound] = useState(0);
  const [guessState, setGuessState] = useState<GuessState>();
  const currentCountryIndex = useMemo(
    () => countryIndices[currentRound],
    [countryIndices, currentRound]
  );

  const { shapeData } = useCountryShape(currentGuess?.iso);
  const { data: searchedCountry } = useCountryData(currentCountryIndex);
  const { elapsedSeconds, stop } = useTimer();

  useEffect(() => {
    if (
      currentGuess &&
      searchedCountry &&
      currentGuess.iso !== searchedCountry.iso
    ) {
      const state = checkGuess(currentGuess, searchedCountry);
      setGuessState(state);
    }
  }, [currentGuess, searchedCountry, settings]);

  useEffect(() => {
    if (!currentGuess || !searchedCountry) return;
    if (currentGuess.iso === searchedCountry.iso) {
      setCorrectGuesses([...correctGuesses, currentGuess]);
      setCurrentRound(currentRound + 1);
      setShowCorrectMessage(true);
      setTimeout(() => setShowCorrectMessage(false), 1000);
    }
  }, [currentGuess, searchedCountry, correctGuesses, currentRound]);
  const router = useRouter();
  useEffect(() => {
    if (currentRound >= settings.rounds) {
      setGuessState(undefined);
      setGameWon(true);
      stop();
    }
  }, [currentRound, settings, router, stop]);

  return (
    <>
      <Meta></Meta>
      <Container>
        {gameWon && (
          <div className="flex flex-col w-screen h-screen justify-center items-center">
            <h1 className="text-3xl lg:text-8xl animate-pulse duration-1000 font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-accent1 to-accent2">
              You did it!
            </h1>
            <h4 className="text-xl font-bold text-accent1">
              Congrats, it took you {elapsedSeconds} seconds!
            </h4>
            <div className="flex gap-2 mt-20">
              <Button onClick={() => router.reload()}>Play again</Button>
              <Link href="/game/start">
                <button className="w-16 h-16 rounded-full hover:scale-105 bg-brand border border-white border-solid text-white text-center">
                  <SettingsIcon className="w-8 h-8 m-auto" />
                </button>
              </Link>
            </div>
          </div>
        )}
        {!gameWon && (
          <div className="flex flex-col w-screen min-h-screen items-center gap-8">
            <div className="lg:h-96 h-72 w-screen abolute">
              <Map
                center={currentGuess ?? { latitude: 49, longitude: 10 }}
                geojson={shapeData}
                guessState={guessState}
                settings={settings}
              />
              <div className="absolute top-0 text-right right-0 p-2 text-lg font-bold bg-white m-2 rounded-lg">
                <div>
                  Round {currentRound + 1}/{settings.rounds}
                </div>
                <div>{elapsedSeconds} s</div>
              </div>
              <div className="absolute top-0 left-0 w-screen lg:h-96 h-72 pointer-events-none flex justify-center items-center flex-col text-center">
                {showCorrectMessage && (
                  <h1 className="text-5xl animate-ping duration-1000 font-extrabold text-brand">
                    Correct!
                  </h1>
                )}
              </div>
            </div>
            <CountrySearchField onCountryInput={setCurrentGuess} />
            <CorrectCountriesDisplay
              countries={correctGuesses}
              rounds={settings.rounds}
            />
          </div>
        )}
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = ctx.query;
  if (token && typeof token === "string") {
    const settings = await getChallengeTokenSettings(token);
    if (settings) {
      return {
        props: {
          countryIndices: settings.countryIds,
          settings: {
            rounds: settings.rounds,
            showDirection: settings.showDirections,
            showBorders: settings.showCountryBorders,
            showPercentage: settings.showPercentage,
          },
        },
      };
    }
  }

  let rounds = 5;
  const roundsString = ctx.query.rounds;
  if (roundsString && typeof roundsString === "string") {
    const value = parseInt(roundsString);
    if (!isNaN(value)) rounds = value;
  }

  let showDirection = false;
  const showDirString = ctx.query.showDirs;
  if (showDirString && typeof showDirString === "string") {
    const value = showDirString === "true";
    showDirection = value;
  }
  let showBorders = false;
  const showBordersString = ctx.query.showBorders;
  if (showBordersString && typeof showBordersString === "string") {
    const value = showBordersString === "true";
    showBorders = value;
  }

  let showPercentage = false;
  const showPercentageString = ctx.query.showPercentage;
  if (showPercentageString && typeof showPercentageString === "string") {
    const value = showPercentageString === "true";
    showPercentage = value;
  }

  const countryIndices = generateDistinctNumbers(rounds, 0, 198);
  return {
    props: {
      countryIndices,
      settings: {
        rounds,
        showDirection,
        showBorders,
        showPercentage,
      },
    },
  };
};

export default GamePage;
