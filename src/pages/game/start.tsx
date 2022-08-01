import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import ChallengeButton from "../../components/challengeButton";
import { Button } from "../../components/common/button";
import Checkbox from "../../components/common/checkbox";
import Container from "../../components/common/container";
import Meta from "../../components/common/meta";
import Spinner from "../../components/common/spinner";
import Title from "../../components/common/title";
import { trpc } from "../../utils/trpc";

const settingsSchema = z.object({
  rounds: z.number().min(3).max(10),
  showCountryBorders: z.boolean(),
  showDirections: z.boolean(),
  showPercentage: z.boolean(),
});

const useLocalSettings = (props: ReturnType<typeof useGameSettings>) => {
  useEffect(() => {
    const settingsJson = window.localStorage.getItem("game-settings");
    if (!settingsJson) return;
    try {
      const json = JSON.parse(settingsJson);
      const result = settingsSchema.safeParse(json);
      if (result.success) {
        const {
          setShowCountryBorders,
          setShowDirections,
          setShowPercentage,
          setRounds,
        } = props;
        setShowCountryBorders(result.data.showCountryBorders);
        setShowDirections(result.data.showDirections);
        setShowPercentage(result.data.showPercentage);
        setRounds(result.data.rounds);
      }
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSettings = () => {
    const item = settingsSchema.parse(props);
    const json = JSON.stringify(item);
    localStorage.setItem("game-settings", json);
  };

  return { saveSettings };
};

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
  const [token, setToken] = useState<string>();
  const settings = useGameSettings();
  const { mutate: registerToken, isLoading } = trpc.useMutation(
    "game.register-token",
    {
      onSuccess() {
        router.push(`/game/name?challenge=${token}`);
      },
    }
  );
  const { saveSettings } = useLocalSettings(settings);
  const router = useRouter();
  const handleStart = () => {
    saveSettings();
    if (!token) {
      router.push(settings.url);
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
          <ChallengeButton onTokenGenerate={setToken}></ChallengeButton>

          <button
            disabled={isLoading}
            className="bg-transparent text-white mt-8 -mb-4 hover:scale-105 font-medium"
            onClick={() => settings.reset}
          >
            Reset values
          </button>
          <Button
            disabled={isLoading}
            onClick={handleStart}
          >
            Start
          </Button>
        </div>
      </Container>
    </>
  );
};

export default StartPage;
