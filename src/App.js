import React, { useState } from "react";
import "./App.css";

import PasswordInput from "./components/PasswordInput";
import StrengthIndicator from "./components/StrengthIndicator";
import XPDisplay from "./components/XPDisplay";

import { calculateXP, calculateLevel } from "./utils/passwordScore";

function App() {
  const [password, setPassword] = useState("");
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  function handlePasswordChange(value) {
    setPassword(value);

    const newXp = calculateXP(value);
    const newLevel = calculateLevel(newXp);

    setXp(newXp);
    setLevel(newLevel);
  }

  const strengthLabel = password.length === 0 ? "---" :
    xp < 60 ? "Weak" : xp < 180 ? "Medium" : "Strong";

  return (
    <div className="container">
      <h1>Password XP — Password Strength Game</h1>

      <PasswordInput password={password} onPasswordChange={handlePasswordChange} />

      <StrengthIndicator strength={strengthLabel} />

      <XPDisplay xp={xp} level={level} />
    </div>
  );
}

export default App;