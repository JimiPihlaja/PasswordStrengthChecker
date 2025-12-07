import React, { useEffect, useState, useCallback } from "react";
import Grid from "./components/Grid";
import Keyboard from "./components/Keyboard";
import ResultPopup from "./components/ResultPopup";
import { fetchDailyChallenge, analyzePassword } from "./utils/fetchChallenge";
import { evaluateGuess } from "./utils/evaluateGuess";
import "./styles/challenge.css";
import HintSystem from "./components/HintSystem";

function App() {
  const [challenge, setChallenge] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [results, setResults] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [popup, setPopup] = useState({ visible: false });
  const [hints, setHints] = useState([]); // <-- Vihjeet talteen

  const MAX_LENGTH = 14;
  const MAX_TRIES = 6;

  // Haetaan päivän haaste
  useEffect(() => {
    fetchDailyChallenge().then(setChallenge);
  }, []);

  // ----------- HANDLERS -----------

  const handleKey = useCallback(
    (char) => {
      setCurrentGuess((prev) =>
        prev.length < MAX_LENGTH ? prev + char.toLowerCase() : prev
      );
    },
    [MAX_LENGTH]
  );

  const handleDelete = useCallback(() => {
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, []);

  const handleEnter = useCallback(async () => {
    if (!currentGuess || !challenge) return;

    const challengeWord = challenge.word.toLowerCase().slice(0, MAX_LENGTH);

    // Analysoidaan salasanan sisältö
    const scoreData = await analyzePassword(currentGuess);

    // TALLENNA VIHJEET
    setHints(scoreData.hints || []);

    // Wordle-väritys
    const evaluation = evaluateGuess(currentGuess, challengeWord);

    setGuesses((prev) => [...prev, currentGuess]);
    setResults((prev) => [...prev, evaluation]);

    // Voitto
    if (currentGuess === challengeWord) {
      setPopup({
        visible: true,
        success: true,
        correctWord: challengeWord,
        score: scoreData.score,
      });
    }
    // Häviö
    else if (guesses.length + 1 === MAX_TRIES) {
      setPopup({
        visible: true,
        success: false,
        correctWord: challengeWord,
        score: scoreData.score,
      });
    }

    setCurrentGuess("");
  }, [challenge, currentGuess, guesses.length, MAX_LENGTH, MAX_TRIES]);

  // ----------- KÄYTTÄJÄN NÄPPÄIMISTÖ (KEYDOWN) -----------

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

      const allowed = /^[a-zA-Z0-9!@#$%^&*()_\-=+[{\]}|;:'",.<>/?`~]$/;

      if (allowed.test(key)) {
        handleKey(key);
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleEnter, handleDelete, handleKey]);

  // ----------- LATAUS -----------

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

      <Keyboard onKey={handleKey} onEnter={handleEnter} onDelete={handleDelete} />

      {/* VIHJEET TÄSSÄ */}
      <HintSystem hints={hints} />

      <ResultPopup {...popup} />
    </div>
  );
}

export default App;
