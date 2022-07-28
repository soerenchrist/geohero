import { NextPage } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";
import Checkbox from "../../components/common/checkbox";
import Container from "../../components/common/container";
import Meta from "../../components/common/meta";
import Spinner from "../../components/common/spinner";

const useGameSettings = () => {
  const [rounds, setRounds] = useState(5);
  const [showCountryBorders, setShowCountryBorders] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [showPercentage, setShowPercentage] = useState(false);

  const url = useMemo(
    () =>
      `/game?rounds=${rounds}&showBorders=${showCountryBorders}&showDirs=${showDirections}&showPercentage=${showPercentage}`,
    [rounds, showCountryBorders, showDirections, showPercentage]
  );

  const reset = () => {
    setRounds(5);
    setShowCountryBorders(false);
    setShowDirections(false);
    setShowPercentage(false);
  };

  return {
    rounds,
    setRounds,
    showCountryBorders,
    setShowCountryBorders,
    showDirections,
    setShowDirections,
    showPercentage,
    setShowPercentage,
    url,
    reset,
  };
};

const StartPage: NextPage = () => {
  const settings = useGameSettings();
  return (
    <>
      <Meta />
      <Container>
        <div className="h-screen w-full flex justify-center flex-col items-center gap-6">
          <Spinner
            label="Rounds"
            value={settings.rounds}
            onChange={settings.setRounds}
          />

          <Checkbox
            label="Show country borders"
            checked={settings.showCountryBorders}
            onChange={settings.setShowCountryBorders}
          ></Checkbox>
          <Checkbox
            label="Show directions"
            checked={settings.showDirections}
            onChange={settings.setShowDirections}
          ></Checkbox>
          <Checkbox
            label="Show percentage"
            checked={settings.showPercentage}
            onChange={settings.setShowPercentage}
          ></Checkbox>

          <button
            className="bg-transparent text-white mt-8 -mb-4 hover:scale-105 font-medium"
            onClick={() => settings.reset}
          >
            Reset values
          </button>
          <Link href={settings.url}>
            <button className="w-48 h-16 text-lg font-medium rounded-full hover:scale-105 bg-white">
              Start
            </button>
          </Link>
        </div>
      </Container>
    </>
  );
};

export default StartPage;
