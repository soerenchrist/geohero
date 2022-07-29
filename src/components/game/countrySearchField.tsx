import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import { Country } from "../../server/types/country";
import { trpc } from "../../utils/trpc";

const CountrySearchField: React.FC<{
  onCountryInput: (country: Country) => void;
}> = ({ onCountryInput }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();
  const [search, setSearch] = useState(false);
  trpc.useQuery(
    [
      "game.check-country-by-name",
      {
        name: name.toLowerCase(),
      },
    ],
    {
      enabled: search && name.length > 3,
      onSuccess(country) {
        if (country) {
          setError(undefined);
          setName("");
          onCountryInput(country);
        } else {
          setName("");
          setError("Country not found");
        }
      },
      refetchOnWindowFocus: false,
    }
  );
  const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(false);
    setName(e.target.value);
  };

  const handleKeys: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      setSearch(true);
    }
  };

  return (
    <input
      className={`w-64 px-4 font-medium text-lg text-center h-16 rounded-full ${
        error
          ? "border-red-500 bg-red-100 placeholder:text-red-600"
          : "placeholder:text-gray-400"
      }`}
      value={name}
      onKeyDown={handleKeys}
      placeholder={error || "Enter country name"}
      onChange={handleInput}
    ></input>
  );
};

export default CountrySearchField;
