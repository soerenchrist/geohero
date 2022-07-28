import { useState } from "react";
import { Country } from "../../server/types/country";
import { trpc } from "../../utils/trpc";

const CountrySearchField: React.FC<{
  onCountryInput: (country: Country) => void;
}> = ({ onCountryInput }) => {
  const [name, setName] = useState("");
  trpc.useQuery(
    [
      "game.check-country-by-name",
      {
        name: name.toLowerCase(),
      },
    ],
    {
      enabled: name.length > 3,
      onSuccess(country) {
        if (country) {
          setName("");
          onCountryInput(country);
        }
      },
    }
  );

  return (
    <input
      className="w-64 px-4 font-medium placeholder:text-gray-400 text-lg text-center h-16 rounded-full"
      value={name}
      placeholder="Enter country name"
      onChange={(e) => setName(e.target.value)}
    ></input>
  );
};

export default CountrySearchField;
