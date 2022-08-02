import { GetServerSideProps, NextPage } from "next";
import { getChallengeTokenSettings } from "../../server/data/dynamo";
import { getUserToken } from "../../server/util/getUserToken";

const ChallengePage: NextPage = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  getUserToken(ctx.req, ctx.res);

  const { token } = ctx.query;
  if (token && typeof token === "string") {
    const settings = await getChallengeTokenSettings(token);
    if (!settings) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
        props: {},
      };
    }
    return {
      redirect: {
        destination: `/name?game=${settings.game}&challenge=${token}`,
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
