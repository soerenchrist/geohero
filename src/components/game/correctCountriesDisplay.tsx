import { useMemo, useState } from "react";
import { Country } from "../../server/types/country";
import { trpc } from "../../utils/trpc";
function blobToBase64(blob: Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      var base64 = dataUrl.split(",")[1];
      return resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
}

const Cell: React.FC<{ country?: Country }> = ({ country }) => {
  const [image, setImage] = useState<string>();
  trpc.useQuery(
    [
      "game.get-country-flag-url",
      {
        iso: country?.iso ?? "",
      },
    ],
    {
      refetchOnWindowFocus: false,
      enabled: country != null,
      async onSuccess(url) {
        const response = await fetch(url);
        const svg = await response.blob();
        const base64data = await blobToBase64(svg);

        setImage(`data:image/svg+xml;base64,${base64data}`);
      },
    }
  );

  return (
    <div className="w-full h-32 lg:h-52 rounded-lg flex flex-col gap-3 justify-center text-xl lg:text-3xl font-bold items-center text-center bg-gradient-to-br from-accent1 to-accent2">
      {image && (
        <img
          src={image}
          className="max-h-12 max-w-1/2"
          alt={country!.name}
        ></img>
      )}
      {!image && country && <div className="h-12" />}
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
    <div className="w-full px-8 pb-8 gap-4 grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2">
      {results.map((result, i) => (
        <Cell key={i} country={result} />
      ))}
    </div>
  );
};

export default CorrectCountriesDisplay;
