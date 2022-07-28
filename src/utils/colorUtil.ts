export const getBlendedColor = (percentage: number) => {
  if (percentage > 100) percentage = 100;
  if (percentage < 0) percentage = 0;

  const color = getBlendedColorInternal(percentage);
  return toHex(color);
};

const toHex = (color: readonly [number, number, number]) => {
  const r = color[0].toString(16).padStart(2, "0");
  const g = color[1].toString(16).padStart(2, "0");
  const b = color[2].toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
};

const getBlendedColorInternal = (percentage: number) => {
  if (percentage < 50)
    return interpolate([255, 0, 0], [0, 255, 255], percentage / 50);
  return interpolate([0, 255, 255], [0, 255, 0], (percentage - 50) / 50);
};

const interpolate = (
  color1: [number, number, number],
  color2: [number, number, number],
  fraction: number
) => {
  const r = interpolateNumber(color1[0], color2[0], fraction);
  const g = interpolateNumber(color1[1], color2[1], fraction);
  const b = interpolateNumber(color1[2], color2[2], fraction);

  return [Math.round(r), Math.round(g), Math.round(b)] as const;
};

const interpolateNumber = (d1: number, d2: number, fraction: number) => {
  return d1 + (d2 - d1) * fraction;
};
