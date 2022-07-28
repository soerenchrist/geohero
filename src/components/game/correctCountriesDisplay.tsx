import { useMemo } from "react";
import { Country } from "../../server/types/country";

const Cell: React.FC<{ country?: Country }> = ({ country }) => {
  return (
    <div className="w-full bg-highlight-card h-32 lg:h-52 rounded-lg flex justify-center text-xl lg:text-3xl font-bold text-white items-center text-center">
      {!country && <h3>?</h3>}
      {country && <h3>{country.name}</h3>}
    </div>
  );
};

const CorrectCountriesDisplay: React.FC<{
  countries: Country[];
  rounds: number;
}> = ({ rounds, countries }) => {
  const results = useMemo(() => {
    const items: (Country | undefined)[] = [];
    for (let i = 0; i < rounds; i++) {
      const element = countries[i];
      items.push(element);
    }
    return items;
  }, [rounds, countries]);

  return (
    <div className="w-full px-8 pb-8 gap-4 grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1">
      {results.map((result, i) => (
        <Cell key={i} country={result} />
      ))}
    </div>
  );
};

export default CorrectCountriesDisplay;
