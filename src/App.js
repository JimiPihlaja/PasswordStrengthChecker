import React, { useState, useEffect } from "react";
import "./App.css";
import { submitScore } from "./api/leaderboard";
import PlayerNameInput from "./components/PlayerNameInput";
import PasswordInput from "./components/PasswordInput";
import StrengthIndicator from "./components/StrengthIndicator";
import XPDisplay from "./components/XPDisplay";
import XPFloatPopup from "./components/XPFloatPopup";
import Leaderboard from "./components/Leaderboard";


import { calculateXP, calculateLevel } from "./utils/passwordScore";

function App() {
  const [password, setPassword] = useState("");
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [previousXP, setPreviousXP] = useState(0);
  const [xpGain, setXpGain] = useState(0);


  // 🔥 Tarvitaan level-muutoksen seurantaan
  const [previousLevel, setPreviousLevel] = useState(1);

  // 🔥 TEMP – korvaa myöhemmin oikealla nimellä (nimikenttä-komponentti)
  const [playerName, setPlayerName] = useState("Guest");


  function handlePasswordChange(value) {
    setPassword(value);

    const newXp = calculateXP(value);
    const newLevel = calculateLevel(newXp);

    // XP gain
    const delta = newXp - previousXP;
    if (delta > 0) setXpGain(delta);
    setPreviousXP(newXp);

    setXp(newXp);
    setLevel(newLevel);
  }

  // 🔥 Kun level muuttuu → lähetetään score backendille
  useEffect(() => {
    if (level > previousLevel) {
      submitScore(playerName, level);
    }
    setPreviousLevel(level);
  }, [level, previousLevel, playerName]);

  const strengthLabel =
    password.length === 0
      ? "---"
      : xp < 60
      ? "Weak"
      : xp < 180
      ? "Medium"
      : "Strong";

  return (
    <div className="container">
      <h1>Password Strength Game</h1>

      <PlayerNameInput onNameChange={setPlayerName} />
      <PasswordInput password={password} onPasswordChange={handlePasswordChange} />

      <StrengthIndicator strength={strengthLabel} />
      <XPFloatPopup amount={xpGain} />
      <XPDisplay xp={xp} level={level} />
      <Leaderboard />

    </div>
  );
}

export default App;
