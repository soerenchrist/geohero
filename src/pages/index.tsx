import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "../components/common/button";
import Container from "../components/common/container";
import Meta from "../components/common/meta";
import Title from "../components/common/title";
import HowToPlay from "../components/howToPlay";
import { getUserToken } from "../server/util/getUserToken";

const Home: NextPage = () => {
  const [showHowTo, setShowHowTo] = useState(false);
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
            <Button
              className="w-16"
              variant="secondary"
              onClick={() => setShowHowTo(!showHowTo)}
            >
              ?
            </Button>
          </div>
          <HowToPlay show={showHowTo} />
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
