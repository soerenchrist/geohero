import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import { Country } from "../../server/types/country";
import { trpc } from "../../utils/trpc";
import SendIcon from "../icons/send";

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
    <div className="flex">
      <input
        className={`w-64 px-4 font-medium text-lg text-center h-16 rounded-l-full ${
          error
            ? "border-red-500 bg-red-100 placeholder:text-red-600"
            : "placeholder:text-gray-400"
        }`}
        value={name}
        onKeyDown={handleKeys}
        placeholder={error || "Enter country name"}
        onChange={handleInput}
      ></input>
      <button
        className="w-16 h-16 rounded-r-full  bg-gradient-to-br from-pink-300 to-rose-500"
        onClick={() => setSearch(true)}
      >
        <SendIcon className="w-6 h-6 m-auto text-white" />
      </button>
    </div>
  );
};

export default CountrySearchField;
