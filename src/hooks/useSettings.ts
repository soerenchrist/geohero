import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import qs from "qs";

export const useGameSettings = <
  TSchema extends z.ZodType,
  TValue extends z.infer<TSchema>
>(
  key: string,
  settingsSchema: TSchema,
  defaultValues: TValue
) => {
  const [settings, setSettings] = useState<TValue>(defaultValues);

  const url = useMemo(() => qs.stringify(settings), [settings]);

  const reset = () => {
    setSettings(defaultValues);
  };

  const setSettingValue = <K extends keyof TValue, J extends TValue[K]>(
    key: K,
    value: J
  ) => {
    setSettings({
      ...settings,
      [key]: value,
    });
  };

  const { saveSettings } = useLocalStoredSettings(
    key,
    settingsSchema,
    setSettings,
    settings
  );

  return {
    settings,
    setSettingValue,
    saveSettings,
    url,
    reset,
  };
};

const useLocalStoredSettings = <
  TSchema extends z.ZodType,
  TValue extends z.infer<TSchema>
>(
  key: string,
  schema: TSchema,
  setSettings: (values: TValue) => void,
  values: TValue
) => {
  useEffect(() => {
    const settingsJson = window.localStorage.getItem(key);
    if (!settingsJson) return;
    try {
      const json = JSON.parse(settingsJson);
      const result = schema.safeParse(json);
      if (result.success) {
        setSettings(result.data);
      }
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSettings = () => {
    const item = schema.parse(values);
    const json = JSON.stringify(item);
    localStorage.setItem(key, json);
  };

  return { saveSettings };
};
