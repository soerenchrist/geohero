import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Card from "../components/common/card";
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
          <div className="grid grid-cols-1 lg:grid-cols-2 max-w-lg gap-4">
            <Card
              title="Country Search"
              onClick={() => router.push("/country-search/start")}
            >
              Try to find the searched countries as fast as possible!
            </Card>
            <Card
              title="World Guesser"
              onClick={() => router.push("/world-guesser/start")}
            >
              Name all the countries you know!
            </Card>
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
