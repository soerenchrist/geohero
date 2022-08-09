import Link from "next/link";

const Title = () => {
  return (
    <Link href="/">
      <h1 className="text-5xl lg:text-8xl cursor-pointer font-extrabold text-white">
        Geo
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent1 to-accent2">
          Hero
        </span>
      </h1>
    </Link>
  );
};

export default Title;
