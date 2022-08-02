import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import Container from "../../components/common/container";
import Meta from "../../components/common/meta";
import CorrectCountriesDisplay from "../../components/country-search/correctCountriesDisplay";
import CountrySearchField from "../../components/common/countrySearchField";
import GameFinishedScreen from "../../components/country-search/gameFinishedScreen";
import { useGameStats } from "../../hooks/useGameStats";
import { useUsername } from "../../hooks/useUsername";
import {
  getChallengeTokenSettings,
  getUserResult,
} from "../../server/data/dynamo";
import { Country } from "../../server/types/country";
import { type GeoJson } from "../../server/types/geojson";
import { type CountrySearchSettings } from "../../server/types/settings";
import { getUserToken } from "../../server/util/getUserToken";
import { checkGuess, type GuessState } from "../../utils/coordinateUtil";
import { generateDistinctNumbers } from "../../utils/randomUtil";
import { trpc } from "../../utils/trpc";

const Map = dynamic(() => import("../../components/maps/gameMap"), {
  ssr: false,
});

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
      try {
        const response = await fetch(url);
        setShapeData(await response.json());
      } catch (e) {}
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
    }
  );
};

const GamePage: NextPage<{
  settings: CountrySearchSettings;
  isChallenge: boolean;
  challengeToken: string;
}> = ({ settings, isChallenge, challengeToken }) => {
  const { name } = useUsername();
  const [gameWon, setGameWon] = useState(false);
  const [correctGuesses, setCorrectGuesses] = useState<Country[]>([]);
  const [showCorrectMessage, setShowCorrectMessage] = useState(false);
  const [currentGuess, setCurrentGuess] = useState<Country>();
  const [currentRound, setCurrentRound] = useState(0);
  const [guessState, setGuessState] = useState<GuessState>();
  const currentCountryIndex = useMemo(
    () => settings.countryIndices[currentRound],
    [settings, currentRound]
  );
  const { mutate: saveUserResult } = trpc.useMutation("game.save-user-result");
  const { shapeData } = useCountryShape(currentGuess?.iso);
  const { data: searchedCountry } = useCountryData(currentCountryIndex);
  const { elapsedSeconds, guesses, addGuess, startTime, stop } = useGameStats();

  const handleGameFinished = () => {
    const durationMillis = new Date().getTime() - startTime.current!.getTime();
    setGuessState(undefined);
    setGameWon(true);
    stop();

    if (isChallenge && challengeToken) {
      saveUserResult({
        challengeToken,
        timeInMillis: durationMillis,
        date: new Date().toISOString(),
        game: "country-search",
        name,
        guesses: guesses + 1, // last guess is not updated yet
      });
    }
  };

  const handleCorrectGuess = (guess: Country) => {
    setCorrectGuesses([...correctGuesses, guess]);
    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);
    setShowCorrectMessage(true);
    setTimeout(() => setShowCorrectMessage(false), 1000);
  };

  const handleGuess = (guess: Country) => {
    setCurrentGuess(guess);
    if (!searchedCountry) return;

    addGuess();
    const state = checkGuess(guess, searchedCountry);
    setGuessState(state);
    if (guess.iso === searchedCountry.iso) {
      handleCorrectGuess(guess);
      if (currentRound + 1 === settings.rounds) {
        handleGameFinished();
      }
    }
  };

  return (
    <>
      <Meta></Meta>
      <Container>
        <GameFinishedScreen
          show={gameWon}
          countries={correctGuesses}
          guesses={guesses}
          isChallenge={isChallenge}
          challengeToken={challengeToken}
          rounds={settings.rounds}
          elapsedSeconds={elapsedSeconds}
        />
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
            <CountrySearchField onCountryInput={handleGuess} />
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
  const userToken = getUserToken(ctx.req, ctx.res);
  const { challenge } = ctx.query;
  if (challenge && typeof challenge === "string") {
    const result = await getUserResult(challenge, userToken);
    if (result) {
      return {
        redirect: {
          destination: "/country-search/result?challenge=" + challenge,
        },
        props: {},
      };
    }

    const challengeTokenSettings = await getChallengeTokenSettings(challenge);
    if (
      challengeTokenSettings &&
      challengeTokenSettings.game === "country-search"
    ) {
      const settings = challengeTokenSettings.settings as CountrySearchSettings;
      return {
        props: {
          settings,
          isChallenge: true,
          challengeToken: challenge,
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

  let showDirections = false;
  const showDirString = ctx.query.showDirs;
  if (showDirString && typeof showDirString === "string") {
    const value = showDirString === "true";
    showDirections = value;
  }
  let showCountryBorders = false;
  const showBordersString = ctx.query.showBorders;
  if (showBordersString && typeof showBordersString === "string") {
    const value = showBordersString === "true";
    showCountryBorders = value;
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
      settings: {
        rounds,
        showDirections,
        showCountryBorders,
        showPercentage,
        countryIndices,
      },
      isChallenge: false,
    },
  };
};

export default GamePage;
