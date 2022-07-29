import { useRouter } from "next/router";
import { Country } from "../../server/types/country";
import { Button } from "../common/button";
import HomeIcon from "../icons/home";
import CorrectCountriesDisplay from "./correctCountriesDisplay";

const GameFinishedScreen: React.FC<{
  elapsedSeconds: number;
  guesses: number;
  countries: Country[];
  show: boolean;
  isChallenge: boolean;
  showCountries?: boolean;
  rounds: number;
}> = ({
  show,
  elapsedSeconds,
  showCountries,
  countries,
  rounds,
  guesses,
  isChallenge,
}) => {
  const router = useRouter();
  return (
    <div
      className={`flex flex-col w-screen absolute top-0 left-0 transition-opacity duration-1000 min-h-screen justify-center items-center ${
        show
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <h1 className="text-3xl lg:text-8xl mt-8 animate-pulse duration-1000 font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-accent1 to-accent2">
        You did it!
      </h1>
      <h4 className="text-xl font-bold text-accent1">
        Congrats, it took you {elapsedSeconds} seconds and {guesses} guesses!
      </h4>
      <div className="flex gap-2 mt-20">
        <Button
          onClick={() =>
            isChallenge ? router.push("/game/start") : router.reload()
          }
        >
          Play again
        </Button>
        <button
          onClick={() => router.push("/")}
          className="w-16 h-16 rounded-full hover:scale-105 bg-brand border border-white border-solid text-white text-center"
        >
          <HomeIcon className="w-8 h-8 m-auto" />
        </button>
      </div>
      <div className="p-8"></div>
      {showCountries === null ||
        (showCountries === true && (
          <CorrectCountriesDisplay countries={countries} rounds={rounds} />
        ))}
    </div>
  );
};

export default GameFinishedScreen;
