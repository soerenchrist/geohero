import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Button } from "../../components/common/button";
import Container from "../../components/common/container";
import Meta from "../../components/common/meta";
import { useCountdown } from "../../hooks/useGameStats";
import {
  getChallengeTokenSettings,
  getUserResult,
} from "../../server/data/dynamo";
import { Country } from "../../server/types/country";
import { WorldGuesserSettings } from "../../server/types/settings";
import { getUserToken } from "../../server/util/getUserToken";
import { formatTime } from "../../utils/timeUtil";
import GameFinishedScreen from "../../components/world-guesser/gameFinishedScreen";
import { trpc } from "../../utils/trpc";
import { useUsername } from "../../hooks/useUsername";
import CountryNameInput from "../../components/common/countryNameInput";
import Loader from "../../components/common/loader";

const Map = dynamic(() => import("../../components/maps/worldGuesserMap"), {
  ssr: false,
});

const LocalCountrySearch: React.FC<{
  allCountries: Country[];
  onCorrect: (country: Country) => void;
}> = ({ allCountries, onCorrect }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();

  const handleEnter = () => {
    const result = allCountries.find(
      (x) => x.name.toLowerCase() === name.toLowerCase()
    );
    if (result) {
      onCorrect(result);
    } else {
      setError("Country not found");
    }
    setName("");
  };

  return (
    <CountryNameInput
      name={name}
      onChange={setName}
      error={error}
      onEnter={handleEnter}
    />
  );
};

const GamePage: NextPage<{
  settings: WorldGuesserSettings;
  isChallenge: boolean;
  challengeToken?: string;
}> = ({ settings, isChallenge, challengeToken }) => {
  const allCountries = useRef<Country[]>([]);
  const [remainingCountries, setRemainingCountries] = useState<Country[]>([]);
  const { isLoading, isError } = trpc.useQuery(["game.get-all-countries"], {
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: (countries) => {
      if (countries) {
        allCountries.current = countries;
        setRemainingCountries(countries);
      }
    },
  });
  const { name } = useUsername();
  const [guessedCountries, setGuessedCountries] = useState<Country[]>([]);

  const { mutate: saveUserResult } = trpc.useMutation("game.save-user-result");
  const [message, setMessage] = useState<string>();

  const finishGame = (durationMillis: number) => {
    if (isChallenge && challengeToken) {
      saveUserResult({
        challengeToken,
        date: new Date().toISOString(),
        guesses: guessedCountries.length,
        game: "world-guesser",
        timeInMillis: durationMillis,
        name,
      });
    }
    setGameRunning(false);
  };

  const { remainingSeconds, stop } = useCountdown(
    settings.time * 60,
    finishGame
  );

  const [gameRunning, setGameRunning] = useState(true);
  const handleGuess = (country: Country) => {
    const found = remainingCountries.find((x) => x.index == country.index);

    if (found) {
      setGuessedCountries([...guessedCountries, country]);
      setRemainingCountries(
        remainingCountries.filter((x) => x.index !== country.index)
      );

      setMessage("Correct!");
      setTimeout(() => setMessage(undefined), 500);
    } else {
      setMessage("Already guessed");
      setTimeout(() => setMessage(undefined), 500);
    }

    if (guessedCountries.length === allCountries.current.length) {
      stop();
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-screen w-screen">
          <Loader color="fill-white" className="!w-12 !h-12" />
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <div className="flex justify-center text-2xl text-white items-center h-screen w-screen">
          Something went wrong...
        </div>
      </Container>
    );
  }
  return (
    <>
      <Meta></Meta>
      <Container>
        {!gameRunning && (
          <GameFinishedScreen
            correctCount={guessedCountries.length}
            isChallenge={isChallenge}
            remainingCountries={remainingCountries}
            time={settings.time * 60 - remainingSeconds}
            challengeToken={challengeToken}
          />
        )}
        {gameRunning && (
          <div className="flex flex-col w-screen min-h-screen items-center gap-8">
            <div className="h-144 w-screen abolute">
              <Map
                showCountryBorders={settings.showCountryBorders}
                guessedCountries={guessedCountries}
                showMissingCountries={settings.showMissingCountries}
                allCountries={remainingCountries}
              />

              <div className="absolute top-0 text-right right-0 p-2 text-lg font-bold bg-white m-2 rounded-lg">
                <div>{guessedCountries.length} / 198</div>
                <div>{formatTime(remainingSeconds)}</div>
              </div>
              <div className="absolute top-0 left-0 w-screen lg:h-96 h-72 pointer-events-none flex justify-center items-center flex-col text-center">
                {message && (
                  <h1 className="text-5xl animate-ping duration-500 font-extrabold text-brand">
                    {message}
                  </h1>
                )}
              </div>
            </div>
            <LocalCountrySearch
              allCountries={allCountries.current}
              onCorrect={handleGuess}
            />

            <Button onClick={() => stop()}>Give up</Button>
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
          destination: "/world-guesser/result?challenge=" + challenge,
        },
        props: {},
      };
    }

    const challengeTokenSettings = await getChallengeTokenSettings(challenge);
    if (
      challengeTokenSettings &&
      challengeTokenSettings.game === "world-guesser"
    ) {
      const settings = challengeTokenSettings.settings as WorldGuesserSettings;
      return {
        props: {
          settings,
          isChallenge: true,
          challengeToken: challenge,
        },
      };
    }
  }

  let time = 8;
  const timeString = ctx.query.time;
  if (timeString && typeof timeString === "string") {
    const value = parseInt(timeString);
    if (!isNaN(value)) time = value;
  }

  let showCountryBorders = true;
  const showBordersString = ctx.query.showBorders;
  if (showBordersString && typeof showBordersString === "string") {
    const value = showBordersString === "true";
    showCountryBorders = value;
  }

  let showMissingCountries = false;
  const showMissingCountriesString = ctx.query.showMissingCountries;
  if (
    showMissingCountriesString &&
    typeof showMissingCountriesString === "string"
  ) {
    showMissingCountries = showMissingCountriesString === "true";
  }

  return {
    props: {
      settings: {
        time,
        showCountryBorders,
        showMissingCountries,
      },
      isChallenge: false,
    },
  };
};

export default GamePage;
