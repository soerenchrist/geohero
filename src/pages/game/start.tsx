import { NextPage } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";
import Checkbox from "../../components/common/checkbox";
import Container from "../../components/common/container";
import Spinner from "../../components/common/spinner";

const StartPage: NextPage = () => {
  const [rounds, setRounds] = useState(5);
  const [showCountryBorders, setShowCountryBorders] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  const url = useMemo(
    () =>
      `/game?rounds=${rounds}&showBorders=${showCountryBorders}&showDirs=${showDirections}`,
    [rounds, showCountryBorders, showDirections]
  );

  return (
    <Container>
      <div className="h-screen w-full flex justify-center flex-col items-center gap-6">
        <Spinner label="Rounds" value={rounds} onChange={setRounds} />

        <Checkbox
          label="Show country borders"
          checked={showCountryBorders}
          onChange={setShowCountryBorders}
        ></Checkbox>
        <Checkbox
          label="Show directions"
          checked={showDirections}
          onChange={setShowDirections}
        ></Checkbox>

        <button
          className="bg-transparent text-white mt-8 -mb-4 hover:scale-105 font-medium"
          onClick={() => {
            setRounds(5);
            setShowCountryBorders(false);
            setShowDirections(false);
          }}
        >
          Reset values
        </button>
        <Link href={url}>
          <button className="w-48 h-16 text-lg font-medium rounded-full hover:scale-105 bg-white">
            Start
          </button>
        </Link>
      </div>
    </Container>
  );
};

export default StartPage;
