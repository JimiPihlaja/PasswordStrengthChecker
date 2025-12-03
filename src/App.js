import React from "react";
import "./App.css";

function App() {
  return (
    <div className="container">
      <h1>Password Strength Checker</h1>

      <input
        type="password"
        placeholder="Enter a password"
        className="password-input"
      />

      <div className="strength-output">
        <p>Password strength: <strong>---</strong></p>
      </div>
    </div>
  );
}

export default App;
