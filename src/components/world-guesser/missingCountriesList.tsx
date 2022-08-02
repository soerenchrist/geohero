import { trpc } from "../../utils/trpc";

const ListItem: React.FC<{ index: number }> = ({ index }) => {
  const { data: country, isLoading } = trpc.useQuery(
    [
      "game.get-country-by-index",
      {
        index,
      },
    ],
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="bg-gradient-to-bl from-accent1 to-accent2 w-1/2 h-20 rounded-full">
      <div className="flex justify-start font-medium text-2xl h-full px-8 gap-8 items-center">
        <div className="flex justify-between w-full">
          <span>{country?.name}</span>
        </div>
      </div>
    </div>
  );
};

const MissingCountriesList: React.FC<{ indices: number[] }> = ({ indices }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      {indices.map((i) => (
        <ListItem key={i} index={i} />
      ))}
    </div>
  );
};

export default MissingCountriesList;
