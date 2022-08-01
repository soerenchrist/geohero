import { GetServerSideProps, NextPage } from "next";
import Container from "../../components/common/container";
import Meta from "../../components/common/meta";
import GameFinishedScreen from "../../components/game/gameFinishedScreen";
import { getUserResult } from "../../server/data/dynamo";
import { getUserToken } from "../../server/util/getUserToken";

const GameResultPage: NextPage<{
  guesses: number;
  timeInMillis: number;
  date: Date;
  challenge: string;
}> = ({ guesses, timeInMillis, challenge }) => {
  return (
    <>
      <Meta />
      <Container>
        <GameFinishedScreen
          show={true}
          showCountries={false}
          countries={[]}
          isChallenge={true}
          challengeToken={challenge}
          guesses={guesses}
          rounds={5}
          elapsedSeconds={Math.round(timeInMillis / 1000)}
        />
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const redirect = {
    redirect: {
      destination: "/",
      permanent: false,
    },
    props: {},
  };

  const token = getUserToken(ctx.req, ctx.res);
  if (!token) {
    return redirect;
  }

  const { challenge } = ctx.query;
  if (!challenge || typeof challenge !== "string") return redirect;

  const result = await getUserResult(challenge, token);
  if (!result) return redirect;

  return {
    props: {
      challenge: challenge,
      guesses: result.guesses,
      timeInMillis: result.timeInMillis,
      date: result.date,
    },
  };
};

export default GameResultPage;
