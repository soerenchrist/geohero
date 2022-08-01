import Head from "next/head";

const Meta: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <Head>
      <title>{title || "GeoHero"}</title>
      <meta name="description" content="GeoHero - A geography quiz" />
      <link rel="icon" href="/favicon.png" />
    </Head>
  );
};

export default Meta;
