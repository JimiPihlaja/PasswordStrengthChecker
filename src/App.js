import React, { useState } from "react";
import "./App.css";

import PasswordInput from "./components/PasswordInput";
import StrengthIndicator from "./components/StrengthIndicator";
import XPDisplay from "./components/XPDisplay";
import XPFloatPopup from "./components/XPFloatPopup";

import { calculateXP, calculateLevel } from "./utils/passwordScore";

function App() {
  const [password, setPassword] = useState("");
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [previousXP, setPreviousXP] = useState(0);
  const [xpGain, setXpGain] = useState(0);


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
  const strengthLabel = password.length === 0 ? "---" :
    xp < 60 ? "Weak" : xp < 180 ? "Medium" : "Strong";

  return (
    <div className="container">
      <h1>Password XP — Password Strength Game</h1>

      <PasswordInput password={password} onPasswordChange={handlePasswordChange} />

      <StrengthIndicator strength={strengthLabel} />
      <XPFloatPopup amount={xpGain} />
      <XPDisplay xp={xp} level={level} />
    </div>
  );
}

export default App;