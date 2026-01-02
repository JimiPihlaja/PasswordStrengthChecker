export function evaluateGuess(guess, challengeWord) {
  const result = Array(guess.length).fill("wrong");
  const remaining = challengeWord.split("");

  // 1️⃣ Correct positions
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === challengeWord[i]) {
      result[i] = "correct";
      remaining[i] = null; // kulutetaan merkki
    }
  }

  // 2️⃣ Present (wrong position)
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue;

    const idx = remaining.indexOf(guess[i]);
    if (idx !== -1) {
      result[i] = "present";
      remaining[idx] = null; // kulutetaan merkki
    }
  }

  return result;
}
