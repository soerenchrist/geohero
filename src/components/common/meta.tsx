import Head from "next/head";

const Meta: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <Head>
      <title>{title || "GeoHero"}</title>
      <meta name="description" content="GeoHero" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Meta;
