import type { NextPage } from "next";
import Link from "next/link";
import Meta from "../components/common/meta";

const Home: NextPage = () => {
  return (
    <>
      <Meta />
      <div className="body-bg min-h-screen w-screen">
        <div className="flex flex-col w-full h-screen justify-center gap-4 items-center">
          <h1 className="text-5xl font-extrabold text-white">GeoHero</h1>
          <Link href="/game/start">
          <button className="w-48 h-16 text-lg font-medium rounded-full hover:scale-105 bg-white">Start game</button>
          </Link>
        </div>        
      </div>
    </>
  );
};

export default Home;
