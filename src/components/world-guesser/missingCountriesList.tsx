import { Country } from "../../server/types/country";

const ListItem: React.FC<{ country: Country }> = ({ country }) => {
  return (
    <div className="bg-gradient-to-bl from-accent1 to-accent2 w-1/2 h-20 rounded-full">
      <div className="flex justify-start font-medium text-2xl h-full px-8 gap-8 items-center">
        <div className="flex justify-between w-full">
          <span>{country.name}</span>
        </div>
      </div>
    </div>
  );
};

const MissingCountriesList: React.FC<{ countries: Country[] }> = ({
  countries,
}) => {
  return (
    <div className="flex flex-col items-center gap-3">
      {countries.map((i) => (
        <ListItem key={i.index} country={i} />
      ))}
    </div>
  );
};

export default MissingCountriesList;
