import React, { useEffect, useState, useCallback } from "react";
import Grid from "./components/Grid";
import Keyboard from "./components/Keyboard";
import ResultPopup from "./components/ResultPopup";
import HintSystem from "./components/HintSystem";
import { fetchDailyChallenge, analyzePassword } from "./utils/fetchChallenge";
import { evaluateGuess } from "./utils/evaluateGuess";
import "./styles/challenge.css";

function App() {
  const [challenge, setChallenge] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [results, setResults] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [popup, setPopup] = useState({ visible: false });
  const [hints, setHints] = useState([]);

  const MAX_LENGTH = 14;
  const MAX_TRIES = 6;

  // Fetch daily challenge
  useEffect(() => {
    fetchDailyChallenge().then(setChallenge).catch(() => setChallenge(null));
  }, []);

  const gameOver = popup.visible || guesses.length >= MAX_TRIES;

  // ----------- HANDLERS -----------

  const handleKey = useCallback(
    (char) => {
      if (!challenge) return;
      if (gameOver) return;

      setCurrentGuess((prev) =>
        prev.length < MAX_LENGTH ? prev + char.toLowerCase() : prev
      );
    },
    [MAX_LENGTH, challenge, gameOver]
  );

  const handleDelete = useCallback(() => {
    if (!challenge) return;
    if (gameOver) return;

    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [challenge, gameOver]);

  const handleEnter = useCallback(async () => {
    if (!challenge) return;
    if (gameOver) return;

    // Require exact length like Wordle
    if (currentGuess.length !== MAX_LENGTH) return;

    const challengeWord = challenge.word.toLowerCase().slice(0, MAX_LENGTH);

    // Analyze password -> backend returns { score, messages }
    let scoreData = { score: 0, messages: [] };
    try {
      scoreData = await analyzePassword(currentGuess);
    } catch (e) {
      scoreData = { score: 0, messages: ["Could not analyze password (server error)."] };
    }

    // Show hints/messages from analyzer
    setHints(scoreData.messages || []);

    // Wordle-style evaluation
    const evaluation = evaluateGuess(currentGuess, challengeWord);

    // Push guess + result
    setGuesses((prev) => [...prev, currentGuess]);
    setResults((prev) => [...prev, evaluation]);

    // Win / Lose popup
    if (currentGuess === challengeWord) {
      setPopup({
        visible: true,
        success: true,
        correctWord: challengeWord,
        score: scoreData.score,
      });
    } else if (guesses.length + 1 === MAX_TRIES) {
      setPopup({
        visible: true,
        success: false,
        correctWord: challengeWord,
        score: scoreData.score,
      });
    }

    setCurrentGuess("");
  }, [challenge, currentGuess, MAX_LENGTH, MAX_TRIES, guesses.length, gameOver]);

  // ----------- USER KEYBOARD (keydown) -----------

  useEffect(() => {
    function handleKeyPress(e) {
      const key = e.key;

      if (key === "Enter") {
        handleEnter();
        return;
      }

      if (key === "Backspace") {
        handleDelete();
        return;
      }

      // Allowed characters for password guessing
      const allowed = /^[a-zA-Z0-9!@#$%^&*()_\-=+[{\]}|;:'",.<>/?`~]$/;

      if (allowed.test(key)) {
        handleKey(key);
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleEnter, handleDelete, handleKey]);

  // ----------- LOADING / ERROR -----------

  if (!challenge) return <div>Ladataan päivän haastetta...</div>;

  // ----------- UI -----------

  return (
  <div className="challenge-container">
    <h1>Daily Password Challenge</h1>

    <Grid
      guesses={[...guesses, currentGuess]}
      results={results}
      wordLength={MAX_LENGTH}
    />

    {/* ✅ Vihjeet gridin ja näppäimistön väliin */}
    <HintSystem hints={hints} />

    <Keyboard
      onKey={handleKey}
      onEnter={handleEnter}
      onDelete={handleDelete}
      disabled={popup.visible || guesses.length >= MAX_TRIES}
    />

    <ResultPopup {...popup} />
  </div>
);

}

export default App;
