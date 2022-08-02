export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
};
