export function evaluateGuess(guess, challengeWord) {
  const result = [];

  for (let i = 0; i < guess.length; i++) {
    const char = guess[i];

    if (challengeWord[i] === char) {
      result.push("correct"); // 🟩
    } else if (challengeWord.includes(char)) {
      result.push("present"); // 🟧
    } else {
      result.push("wrong"); // 🟥
    }
  }

  return result;
}
