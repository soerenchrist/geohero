import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Button } from "../components/common/button";
import Container from "../components/common/container";
import Meta from "../components/common/meta";
import Title from "../components/common/title";
import { getUserToken } from "../server/util/getUserToken";

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Meta />
      <Container>
        <div className="flex flex-col w-full h-screen justify-start pt-24 lg:pt-0 lg:justify-center gap-8 items-center">
          <Title />
          <div className="flex flex-col lg:flex-row gap-4">
            <Button
              variant="primary"
              onClick={() => router.push("/game/start")}
            >
              Start game
            </Button>
            <Button variant="secondary">How to play?</Button>
          </div>
        </div>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  getUserToken(ctx.req, ctx.res);
  return {
    props: {},
  };
};

export default Home;
