import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import ChallengeButton from "../../components/challengeButton";
import { Button } from "../../components/common/button";
import Checkbox from "../../components/common/checkbox";
import Container from "../../components/common/container";
import Meta from "../../components/common/meta";
import Spinner from "../../components/common/spinner";
import { useRegisterToken } from "../../hooks/useRegisterToken";
import { useGameSettings } from "../../hooks/useSettings";
import { WorldGuesserSettingsSchema } from "../../server/types/settings";

const StartPage: NextPage = () => {
  const [token, setToken] = useState<string>();
  const { settings, setSettingValue, saveSettings, url, reset } =
    useGameSettings("country-search", WorldGuesserSettingsSchema, {
      time: 10,
      showCountryBorders: true,
      showMissingCountries: false,
    });
  const { registerToken, isLoading } = useRegisterToken("world-guesser");
  const router = useRouter();
  const handleStart = () => {
    saveSettings();
    if (!token) {
      router.push("/world-guesser?" + url);
    } else {
      registerToken({
        token,
        game: "world-guesser",
        settings: settings,
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
            World
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent1 to-accent2">
              Guesser
            </span>
          </h1>
          <Spinner
            label="Time in Minutes"
            value={settings.time}
            min={1}
            max={20}
            onChange={(e) => setSettingValue("time", e)}
          />

          <Checkbox
            label="Show country borders"
            checked={settings.showCountryBorders}
            onChange={(e) => setSettingValue("showCountryBorders", e)}
          ></Checkbox>
          <Checkbox
            label="Show missing countries"
            checked={settings.showMissingCountries}
            onChange={(e) => setSettingValue("showMissingCountries", e)}
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
