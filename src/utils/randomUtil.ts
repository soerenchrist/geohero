
export const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateRandomNumberExcluding = (min: number, max: number, exclude: number[]) => {
  let randomNumber: number;
  do {
    randomNumber = generateRandomNumber(min, max);
  } while (exclude.includes(randomNumber));
  return randomNumber;
}

export const generateDistinctNumbers = (count: number, min: number, max: number) => {
  const numbers: number[] = [];
  if (max - min < count) throw new Error("Unable to generate numbers from min and max")

  while(numbers.length < count) {
    const chosenNumber = generateRandomNumberExcluding(min, max, numbers);
    numbers.push(chosenNumber);
  }

  return numbers;
}