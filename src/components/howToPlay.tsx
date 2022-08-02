const HowToPlay: React.FC<{ show: boolean }> = ({ show }) => {
  return (
    <div
      className={`transition-all duration-700 max-w-lg font-medium text-center text-white ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      GeoHero is a geography based quiz. Try to guess the searched countries as
      fast as possible. Start by guessing any country. The game will present you
      your guess on a map. Depending on how far your guess is away, the color of
      the country will be more red or green. If configured you will get more
      information like distance or direction of the searched country, which will
      make it a bit easier.
    </div>
  );
};

export default HowToPlay;
