import Link from "next/link";

const Title: React.FC<{ small?: boolean }> = ({ small }) => {
  const size = small ? "text-2xl" : "text-5xl lg:text-8xl";

  return (
    <Link href="/">
      <h1
        className={`${size} cursor-pointer font-extrabold text-white`}
      >
        Geo
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent1 to-accent2">
          Hero
        </span>
      </h1>
    </Link>
  );
};

export default Title;
