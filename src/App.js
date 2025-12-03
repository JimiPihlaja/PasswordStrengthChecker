import React, { useState } from "react";
import "./App.css";

import PasswordInput from "./components/PasswordInput";
import StrengthIndicator from "./components/StrengthIndicator";

function App() {
  const [password, setPassword] = useState("");
  const strength = password.length === 0 ? "---" : "checking..."; // dummy value

  return (
    <div className="container">
      <h1>Password Strength Checker</h1>

      <PasswordInput 
        password={password} 
        onPasswordChange={setPassword} 
      />

      <StrengthIndicator strength={strength} />
    </div>
  );
}

export default App;
