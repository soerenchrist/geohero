import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-row justify-center text-white pb-3 gap-4">
      <div>
        Made by{" "}
        <a href="https://soerenchrist.de">
          <span className="hover:font-bold cursor-pointer hover:underline">Sören Christ</span>
        </a>
      </div>
      <div>◉</div>
      <a href="https://github.com/soerenchrist/geohero">
        <span className="hover:font-bold hover:underline cursor-pointer">Github</span>
      </a>
      <div>◉</div>
      <span className="cursor-pointer hover:underline hover:font-bold">How to Play?</span>
    </footer>
  );
};

export default Footer;
