import { NextPage } from "next";
import { useRouter } from "next/router";
import { Button } from "../../components/common/button";
import Container from "../../components/common/container";
import { trpc } from "../../utils/trpc";

const LeaderBoard: React.FC<{ challenge: string }> = ({ challenge }) => {
  const { data: leaderboard } = trpc.useQuery(
    [
      "game.get-leader-board",
      {
        challenge,
      },
    ],
    {
      refetchOnWindowFocus: false,
    }
  );

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <Container>
      <div className="flex lg:justify-center justify-start lg:pt-0 pt-24 items-center h-screen flex-col gap-3">
        <h1 className="text-5xl lg:text-8xl font-extrabold text-white">
          Leader
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent1 to-accent2">
            Board
          </span>
        </h1>
        <div className="p-4" />
        {leaderboard?.map((item, index) => (
          <div
            key={item.userToken}
            className="bg-gradient-to-bl from-accent1 to-accent2 w-1/2 h-20 rounded-full"
          >
            <div className="flex justify-start font-medium text-2xl h-full px-8 gap-8 items-center">
              <span className="font-extrabold text-4xl">{index + 1}</span>
              <div className="flex justify-between w-full">
                <span>{item.name}</span>
                <span>{item.timeInSeconds}s</span>
              </div>
            </div>
          </div>
        ))}
        <Button onClick={handleBack} variant="secondary">
          Back to Result
        </Button>
      </div>
    </Container>
  );
};

const LeaderboardPage: NextPage = () => {
  const router = useRouter();
  const { challenge } = router.query;

  if (challenge && typeof challenge === "string")
    return <LeaderBoard challenge={challenge} />;

  return <></>;
};

export default LeaderboardPage;
