import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "../components/common/button";
import Container from "../components/common/container";
import Meta from "../components/common/meta";
import Title from "../components/common/title";

const Home: NextPage = () => {
  return (
    <>
      <Meta />
      <Container>
        <div className="flex flex-col w-full h-screen justify-start pt-24 lg:pt-0 lg:justify-center gap-8 items-center">
          <Title />
          <div className="flex flex-col lg:flex-row gap-4">
            <Link href="/game/start">
              <Button variant="primary">Start game</Button>
            </Link>
            <Button variant="secondary">How to play?</Button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Home;
