import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { z } from "zod";
import ChallengeButton from "../../components/challengeButton";
import { Button } from "../../components/common/button";
import Checkbox from "../../components/common/checkbox";
import Container from "../../components/common/container";
import Meta from "../../components/common/meta";
import Spinner from "../../components/common/spinner";
import Title from "../../components/common/title";
import {
  useGameSettings,
} from "../../hooks/useSettings";
import { trpc } from "../../utils/trpc";

const settingsSchema = z.object({
  rounds: z.number().min(3).max(10),
  showCountryBorders: z.boolean(),
  showDirections: z.boolean(),
  showPercentage: z.boolean(),
});

const StartPage: NextPage = () => {
  const [token, setToken] = useState<string>();
  const { settings, setSettingValue, saveSettings, url, reset } =
    useGameSettings("country-search", settingsSchema, {
      rounds: 5,
      showCountryBorders: false,
      showDirections: true,
      showPercentage: false,
    });
  const { mutate: registerToken, isLoading } = trpc.useMutation(
    "game.register-token",
    {
      onSuccess() {
        router.push(`/country-search/name?challenge=${token}`);
      },
    }
  );
  const router = useRouter();
  const handleStart = () => {
    saveSettings();
    if (!token) {
      router.push("/country-search?" + url);
    } else {
      registerToken({
        ...settings,
        token,
      });
    }
  };

  return (
    <>
      <Meta />
      <Container>
        <div className="h-screen w-full flex justify-center flex-col items-center gap-6">
          <Title />
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
