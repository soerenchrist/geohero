import { useCallback, useEffect, useRef, useState } from "react";

export const useGameStats = () => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [guesses, setGuesses] = useState(0);
  const startTime = useRef<Date>();
  const timer = useRef<NodeJS.Timer>();

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  }, []);

  const addGuess = useCallback(() => {
    setGuesses(guesses + 1);
  }, [guesses, setGuesses]);

  useEffect(() => {
    startTime.current = new Date();
    timer.current = setInterval(
      () =>
        setElapsedSeconds(
          Math.floor(
            (new Date().getTime() - startTime.current!.getTime()) / 1000
          )
        ),
      500
    );

    return () => {
      clearInterval(timer.current);
    };
  }, []);

  return { elapsedSeconds, stop, guesses, addGuess, startTime };
};

export const useCountdown = (
  seconds: number,
  callback: (durationMillis: number) => void
) => {
  const [remainingSeconds, setRemainingSeconds] = useState(seconds);

  const startTime = useRef<Date>();
  const timer = useRef<NodeJS.Timer>();

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }

    const durationMillis = new Date().getTime() - startTime.current!.getTime();
    callback(durationMillis);
  }, [callback]);

  useEffect(() => {
    startTime.current = new Date();
    timer.current = setInterval(() => {
      const elapsed = Math.floor(
        (new Date().getTime() - startTime.current!.getTime()) / 1000
      );
      setRemainingSeconds(seconds - elapsed);
    }, 500);

    return () => {
      clearInterval(timer.current);
    };
  }, [seconds]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      stop();
    }
  }, [remainingSeconds, callback, stop]);

  return { remainingSeconds, stop };
};
