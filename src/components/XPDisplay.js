import React from "react";
import "./XPDisplay.css"; // pieni tyylitiedosto alla

function XPDisplay({ xp, level }) {
  const xpToNext = xp % 100;
  const percent = Math.min(100, (xpToNext / 100) * 100);

  return (
    <div className="xp-container">
      <div className="xp-header">
        <div className="level-box">LEVEL {level}</div>
        <div className="xp-number">{xp} XP</div>
      </div>

      <div className="xp-bar-outer" aria-hidden>
        <div
          className="xp-bar-inner"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="xp-footer">
        <small>{xpToNext} / 100 XP to next level</small>
      </div>
    </div>
  );
}

export default XPDisplay;