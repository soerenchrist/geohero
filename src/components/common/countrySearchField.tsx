import { useState } from "react";
import { Country } from "../../server/types/country";
import { trpc } from "../../utils/trpc";
import CountryNameInput from "./countryNameInput";

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
  const handleInput = (name: string) => {
    setSearch(false);
    setName(name);
  };

  const handleEnter = () => {
    setSearch(true);
  };

  return (
    <CountryNameInput
      error={error}
      name={name}
      onChange={handleInput}
      onEnter={handleEnter}
    />
  );
};

export default CountrySearchField;
