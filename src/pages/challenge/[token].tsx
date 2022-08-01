import { GetServerSideProps, NextPage } from "next";
import { getUserToken } from "../../server/util/getUserToken";

const ChallengePage: NextPage = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  getUserToken(ctx.req, ctx.res);

  const { token } = ctx.query;
  if (token && typeof token === "string") {
    return {
      redirect: {
        destination: "/game/name?challenge=" + token,
        permanent: false,
      },
      props: {},
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
    props: {},
  };
};

export default ChallengePage;
