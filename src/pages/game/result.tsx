import { GetServerSideProps, NextPage } from "next";
import Container from "../../components/common/container";
import GameFinishedScreen from "../../components/game/gameFinishedScreen";
import { getUserResult } from "../../server/data/dynamo";
import { getUserToken } from "../../server/util/getUserToken";

const GameResultPage: NextPage<{
  guesses: number;
  timeInSeconds: number;
  date: Date;
}> = ({ guesses, timeInSeconds }) => {
  return <Container>
    
    <GameFinishedScreen
          show={true}
          showCountries={false}
          countries={[]}
          isChallenge={true}
          guesses={guesses}
          rounds={5}
          elapsedSeconds={timeInSeconds}
        />
  </Container>;
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
      guesses: result.guesses,
      timeInSeconds: result.timeInSeconds,
      date: result.date,
    },
  };
};

export default GameResultPage;