import { useRouter } from "next/router";
import { Country } from "../../server/types/country";
import { Button } from "../common/button";
import HomeIcon from "../icons/home";
import MissingCountriesList from "./missingCountriesList";

const GameFinishedScreen: React.FC<{
  correctCount: number;
  time: number;
  isChallenge: boolean;
  challengeToken?: string;
  remainingCountries?: Country[];
}> = ({
  correctCount,
  time,
  isChallenge,
  challengeToken,
  remainingCountries,
}) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center pt-20">
      {correctCount === 198 ? (
        <>
          <h1 className="text-3xl lg:text-8xl mt-8 animate-pulse duration-1000 font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-accent1 to-accent2">
            Incredible!
          </h1>
          <h4 className="text-xl font-bold text-accent1">
            You got all 198 countries in {time} seconds!
          </h4>
        </>
      ) : (
        <>
          <h1 className="text-3xl lg:text-8xl mt-8 animate-pulse duration-1000 font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-accent1 to-accent2">
            Not bad!
          </h1>

          <h4 className="text-xl font-bold text-accent1">
            You got {correctCount} out of 198 countries!{" "}
            {correctCount > 0 &&
              `That's ${Math.round((correctCount / 198) * 100)}%!`}
          </h4>
        </>
      )}

      <div className="flex gap-2 mt-20">
        {isChallenge ? (
          <Button
            onClick={() =>
              router.push(`/leaderboard?challenge=${challengeToken}`)
            }
          >
            Show Leaderboard
          </Button>
        ) : (
          <Button onClick={() => router.push("/world-guesser/start")}>
            Play again
          </Button>
        )}
        <button
          onClick={() => router.push("/")}
          className="w-16 h-16 rounded-full hover:scale-105 bg-brand border border-white border-solid text-white text-center"
        >
          <HomeIcon className="w-8 h-8 m-auto" />
        </button>
      </div>
      <div className="w-full pt-20">
        {remainingCountries && (
          <MissingCountriesList countries={remainingCountries} />
        )}
      </div>
    </div>
  );
};

export default GameFinishedScreen;
