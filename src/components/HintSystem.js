import React from "react";
import "./HintSystem.css";

export default function HintSystem({ hints = [] }) {
  if (!hints.length) {
    return (
      <div className="hints-panel empty">
        <p>Ei vihjeitä vielä. Tee arvaus!</p>
      </div>
    );
  }

  return (
    <div className="hints-panel">
      <h3 className="hints-title">Clues</h3>

      {hints.map((hint, index) => (
        <div key={index} className="hint-item">
          {hint}
        </div>
      ))}
    </div>
  );
}
