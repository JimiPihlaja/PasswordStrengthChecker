import React, { useEffect, useState } from "react";
import Grid from "./components/Grid";
import Keyboard from "./components/Keyboard";
import ResultPopup from "./components/ResultPopup";
import { fetchDailyChallenge, analyzePassword } from "./utils/fetchChallenge";
import { evaluateGuess } from "./utils/evaluateGuess";
import "./styles/challenge.css";

function App() {
  const [challenge, setChallenge] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [results, setResults] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [popup, setPopup] = useState({ visible: false });

  const MAX_LENGTH = 14;     // Voidaan vaihtaa 5, 6, 8, 10
  const MAX_TRIES = 6;

  useEffect(() => {
    fetchDailyChallenge().then(setChallenge);
  }, []);

  if (!challenge) return <div>Ladataan päivän haastetta...</div>;

  function handleKey(char) {
    if (currentGuess.length < MAX_LENGTH) {
      setCurrentGuess(currentGuess + char.toLowerCase());
    }
  }

  function handleDelete() {
    setCurrentGuess(currentGuess.slice(0, -1));
  }

  async function handleEnter() {
    if (currentGuess.length === 0) return;

    const challengeWord = challenge.word.toLowerCase().slice(0, MAX_LENGTH);

    // Analysoidaan salasanan sisältö
    const scoreData = await analyzePassword(currentGuess);

    // Arvausväritys Wordlen tapaan
    const evaluation = evaluateGuess(currentGuess, challengeWord);

    setGuesses([...guesses, currentGuess]);
    setResults([...results, evaluation]);

    // Tarkista voitto
    if (currentGuess === challengeWord) {
      setPopup({
        visible: true,
        success: true,
        correctWord: challengeWord,
        score: scoreData.score
      });
    } else if (guesses.length + 1 === MAX_TRIES) {
      setPopup({
        visible: true,
        success: false,
        correctWord: challengeWord,
        score: scoreData.score
      });
    }

    setCurrentGuess("");
  }

  return (
    <div className="challenge-container">
      <h1>Daily Password Challenge </h1>

      <Grid
        guesses={[...guesses, currentGuess]}
        results={results}
        wordLength={MAX_LENGTH}
      />

      <Keyboard
        onKey={handleKey}
        onEnter={handleEnter}
        onDelete={handleDelete}
      />

      <ResultPopup {...popup} />
    </div>
  );
}

export default App;
