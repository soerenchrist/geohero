import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import ChallengeButton from "../../components/challengeButton";
import { Button } from "../../components/common/button";
import Checkbox from "../../components/common/checkbox";
import Container from "../../components/common/container";
import Footer from "../../components/common/footer";
import Meta from "../../components/common/meta";
import Spinner from "../../components/common/spinner";
import Title from "../../components/common/title";
import HowToPlay from "../../components/country-search/howToPlay";
import { useRegisterToken } from "../../hooks/useRegisterToken";
import { useGameSettings } from "../../hooks/useSettings";
import { CountrySearchSettingsSchema } from "../../server/types/settings";
import { generateDistinctNumbers } from "../../utils/randomUtil";

const StartPage: NextPage = () => {
  const [token, setToken] = useState<string>();
  const { settings, setSettingValue, saveSettings, url, reset } =
    useGameSettings("country-search", CountrySearchSettingsSchema, {
      rounds: 5,
      showCountryBorders: false,
      showDirections: true,
      showPercentage: false,
      countryIndices: [] as number[],
    });
  const { registerToken, isLoading } = useRegisterToken("country-search");
  const router = useRouter();
  const handleStart = () => {
    saveSettings();
    if (!token) {
      router.push("/country-search?" + url);
    } else {
      const countryIds = generateDistinctNumbers(settings.rounds, 0, 198);
      settings.countryIndices = countryIds;
      registerToken({
        token,
        game: "country-search",
        settings,
      });
    }
  };

  return (
    <>
      <Meta />
      <Container>
        <div className="h-full w-full flex justify-center flex-col items-center gap-6 pt-20">
          <h1
            className={`text-5xl lg:text-8xl mb-10 font-extrabold text-white`}
          >
            Country
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent1 to-accent2">
              Search
            </span>
          </h1>
          <Spinner
            label="Rounds"
            value={settings.rounds}
            onChange={(e) => setSettingValue("rounds", e)}
          />

          <Checkbox
            label="Show country borders"
            checked={settings.showCountryBorders}
            onChange={(e) => setSettingValue("showCountryBorders", e)}
          ></Checkbox>
          <Checkbox
            label="Show directions"
            checked={settings.showDirections}
            onChange={(e) => setSettingValue("showDirections", e)}
          ></Checkbox>
          <Checkbox
            label="Show percentage"
            checked={settings.showPercentage}
            onChange={(e) => setSettingValue("showPercentage", e)}
          ></Checkbox>
          <ChallengeButton onTokenGenerate={setToken}></ChallengeButton>

          <button
            disabled={isLoading}
            className="bg-transparent text-white mt-8 -mb-4 hover:scale-105 font-medium"
            onClick={() => reset()}
          >
            Reset values
          </button>
          <Button disabled={isLoading} onClick={handleStart}>
            Start
          </Button>
        </div>
      </Container>
    </>
  );
};

export default StartPage;
