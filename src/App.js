import React, { useEffect, useState, useCallback, useMemo } from "react";
import Grid from "./components/Grid";
import Keyboard from "./components/Keyboard";
import ResultPopup from "./components/ResultPopup";
import PasswordStrengthPanel from "./components/PasswordStrengthPanel";
import { fetchDailyChallenge, analyzePassword } from "./utils/fetchChallenge";
import { evaluateGuess } from "./utils/evaluateGuess";
import "./styles/challenge.css";

function buildKeyStatuses(guesses, results) {
  const priority = { wrong: 1, present: 2, correct: 3 };
  const statusMap = {};

  for (let gi = 0; gi < guesses.length; gi++) {
    const guess = guesses[gi] || "";
    const res = results[gi] || [];

    for (let i = 0; i < guess.length; i++) {
      const ch = (guess[i] || "").toLowerCase();
      const st = res[i];
      if (!ch || !st) continue;

      const prev = statusMap[ch];
      if (!prev || priority[st] > priority[prev]) statusMap[ch] = st;
    }
  }

  return statusMap;
}

export default function App() {
  const [challenge, setChallenge] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [results, setResults] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [popup, setPopup] = useState({ visible: false });

  // Analysis for the DAILY correct password shown after game ends
  const [dailyAnalysis, setDailyAnalysis] = useState(null);

  const MAX_LENGTH = 14;
  const MAX_TRIES = 6;

  useEffect(() => {
    fetchDailyChallenge()
      .then(setChallenge)
      .catch(() => setChallenge(null));
  }, []);

  const gameOver = popup.visible || guesses.length >= MAX_TRIES;

  const keyStatuses = useMemo(
    () => buildKeyStatuses(guesses, results),
    [guesses, results]
  );

  const handleKey = useCallback(
    (char) => {
      if (!challenge) return;
      if (gameOver) return;

      const c = String(char).toLowerCase();
      setCurrentGuess((prev) => (prev.length < MAX_LENGTH ? prev + c : prev));
    },
    [MAX_LENGTH, challenge, gameOver]
  );

  const handleDelete = useCallback(() => {
    if (!challenge) return;
    if (gameOver) return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [challenge, gameOver]);

  const endGameAndAnalyzeDaily = useCallback(async (success, correctWordOriginal) => {
    setPopup({ visible: true, success, correctWord: correctWordOriginal });

    try {
      const analysis = await analyzePassword(correctWordOriginal);
      setDailyAnalysis(analysis);
    } catch {
      setDailyAnalysis({
        messages: ["Could not analyze daily password (server error)."],
        crackTimeText: "Not available",
        tips: [],
      });
    }
  }, []);

  const handleEnter = useCallback(async () => {
    if (!challenge) return;
    if (gameOver) return;

  
    if (currentGuess.length !== MAX_LENGTH) return;

    const originalWord = String(challenge.word).slice(0, MAX_LENGTH);

    const challengeWord = originalWord.toLowerCase();

    // Evaluate guess
    const evaluation = evaluateGuess(currentGuess, challengeWord);

    setGuesses((prev) => [...prev, currentGuess]);
    setResults((prev) => [...prev, evaluation]);

    // Win / Lose
    if (currentGuess === challengeWord) {
      await endGameAndAnalyzeDaily(true, originalWord);
    } else if (guesses.length + 1 === MAX_TRIES) {
      await endGameAndAnalyzeDaily(false, originalWord);
    }

    setCurrentGuess("");
  }, [
    challenge,
    currentGuess,
    MAX_LENGTH,
    MAX_TRIES,
    guesses.length,
    gameOver,
    endGameAndAnalyzeDaily,
  ]);

  useEffect(() => {
    function handleKeyPress(e) {
      const key = e.key;

      if (key === "Enter") return void handleEnter();
      if (key === "Backspace") return void handleDelete();

      const allowed = /^[a-zA-Z0-9!@#$%^&*()_\-=+[{\]}|;:'",.<>/?`~]$/;
      if (allowed.test(key)) handleKey(key.toLowerCase());
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleEnter, handleDelete, handleKey]);

  if (!challenge) return <div>Ladataan päivän haastetta...</div>;

  return (
    <div className="challenge-container">
      <h1>Daily Password Challenge</h1>

      <Grid
        guesses={[...guesses, currentGuess]}
        results={results}
        wordLength={MAX_LENGTH}
      />

      <Keyboard
        onKey={handleKey}
        onEnter={handleEnter}
        onDelete={handleDelete}
        disabled={gameOver}
        keyStatuses={keyStatuses}
      />

      <ResultPopup {...popup} />

      {popup.visible && (
        <PasswordStrengthPanel
          dailyPassword={popup.correctWord}   
          dailyAnalysis={dailyAnalysis}       
        />
      )}
    </div>
  );
}
