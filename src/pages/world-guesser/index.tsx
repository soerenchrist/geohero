import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Button } from "../../components/common/button";
import Container from "../../components/common/container";
import Meta from "../../components/common/meta";
import CountrySearchField from "../../components/game/countrySearchField";
import MissingCountriesList from "../../components/world/missingCountriesList";
import { useGameStats } from "../../hooks/useGameStats";
import { Country } from "../../server/types/country";

const Map = dynamic(() => import("../../components/maps/worldGuesserMap"), {
  ssr: false,
});

export type GameSettings = {
  showUnguessed: boolean;
};

const GamePage: NextPage<{ settings: GameSettings }> = ({ settings }) => {
  const unguessedRef = useRef(Array.from(Array(198).keys()));
  const [guessedCountries, setGuessedCountries] = useState<Country[]>([]);
  const [message, setMessage] = useState<string>();
  const { elapsedSeconds, stop } = useGameStats();
  const [gameRunning, setGameRunning] = useState(true);

  const handleGuess = (country: Country) => {
    // Guess is correct
    if (unguessedRef.current.includes(country.index)) {
      setGuessedCountries([...guessedCountries, country]);
      unguessedRef.current = unguessedRef.current.filter(
        (x) => x !== country.index
      );

      setMessage("Correct!");
      setTimeout(() => setMessage(undefined), 500);
    } else {
      setMessage("Already guessed");
      setTimeout(() => setMessage(undefined), 500);
    }
  };

  const giveUp = () => {
    setGameRunning(false);
  };

  return (
    <>
      <Meta></Meta>
      <Container>
        {!gameRunning && (
          <MissingCountriesList indices={unguessedRef.current} />
        )}
        {gameRunning && (
          <div className="flex flex-col w-screen min-h-screen items-center gap-8">
            <div className="h-144 w-screen abolute">
              <Map guessedCountries={guessedCountries} />

              <div className="absolute top-0 text-right right-0 p-2 text-lg font-bold bg-white m-2 rounded-lg">
                <div>{guessedCountries.length} / 198</div>
                <div>{elapsedSeconds} s</div>
              </div>
              <div className="absolute top-0 left-0 w-screen lg:h-96 h-72 pointer-events-none flex justify-center items-center flex-col text-center">
                {message && (
                  <h1 className="text-5xl animate-ping duration-500 font-extrabold text-brand">
                    {message}
                  </h1>
                )}
              </div>
            </div>
            <CountrySearchField onCountryInput={handleGuess} />

            <Button onClick={() => giveUp()}>Give up</Button>
          </div>
        )}
      </Container>
    </>
  );
};

export default GamePage;
