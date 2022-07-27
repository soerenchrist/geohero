import { GetServerSideProps, NextPage } from "next";
import { useMemo, useState } from "react";
import Container from "../../components/common/container";
import { generateDistinctNumbers } from "../../utils/randomutil";
import { trpc } from "../../utils/trpc";

const GamePage: NextPage<{ countryIndices: number[]; rounds: number }> = ({
  countryIndices,
  rounds,
}) => {
  const [currentRound, setCurrentRound] = useState(0);
  const currentCountryIndex = useMemo(
    () => countryIndices[currentRound]!,
    [countryIndices, currentRound]
  );
  const { data: country, isLoading } = trpc.useQuery([
    "game.get-country-by-index",
    {
      index: currentCountryIndex,
    },
  ]);

  return (
    <Container>
      {country?.name}{" "}
      <button onClick={() => setCurrentRound(currentRound + 1)}>Next</button>
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
