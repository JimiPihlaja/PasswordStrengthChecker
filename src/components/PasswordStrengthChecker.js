import React, { useState } from "react";
import "../ui/PasswordStrengthChecker.css";

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hasChecked, setHasChecked] = useState(false);

  const handleChange = (e) => {
    setPassword(e.target.value);
    setHasChecked(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      checkStrength();
    }
  };

  const checkStrength = () => {
    if (!password.trim()) return;
    const strength = estimateStrength(password);
    setScore(strength);
    setFeedback(generateFeedback(password, strength));
    setHasChecked(true);
  };

  function estimateStrength(pwd) {
    if (!pwd) return 0;
    let pool = 0;
    if (/[a-z]/.test(pwd)) pool += 26;
    if (/[A-Z]/.test(pwd)) pool += 26;
    if (/[0-9]/.test(pwd)) pool += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) pool += 32;

    const entropy = pwd.length * Math.log2(pool || 1);
    return Math.min(Math.round((entropy / 100) * 100), 100);
  }

  function generateFeedback(pwd) {
    if (!pwd) return "";
    const suggestions = [];
    if (pwd.length < 8) suggestions.push("Make it longer (12+ characters is better).");
    if (!/[A-Z]/.test(pwd)) suggestions.push("Add an uppercase letter.");
    if (!/[0-9]/.test(pwd)) suggestions.push("Include a number.");
    if (!/[^A-Za-z0-9]/.test(pwd)) suggestions.push("Add a special symbol like ! or @.");
    if (/password|1234|qwerty/i.test(pwd)) suggestions.push("Avoid common words or patterns.");
    return suggestions.length === 0
      ? "Your password looks strong and secure!"
      : suggestions.slice(0, 2).join(" ");
  }

  function getLabel(score) {
    if (score < 30) return { text: "Weak", color: "#e74c3c" };
    if (score < 60) return { text: "Medium", color: "#f39c12" };
    if (score < 85) return { text: "Strong", color: "#27ae60" };
    return { text: "Very Strong", color: "#2ecc71" };
  }

  const label = getLabel(score);

  return (
    <div className="password-checker-container">
      <div className="password-checker-card">
        <h2> Password Strength Checker</h2>

        <input
          type="password"
          value={password}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="Enter your password and press Enter..."
          className="password-input"
        />

        <button onClick={checkStrength} className="password-button">
          Check Strength
        </button>

        {hasChecked && (
          <>
            <div className="strength-bar-bg">
              <div
                className="strength-bar-fill"
                style={{ width: `${score}%` }}
              ></div>
            </div>

            <p
              style={{
                fontWeight: "bold",
                color: label.color,
                fontSize: "18px",
              }}
            >
              Strength: {label.text} ({score}/100)
            </p>

            {feedback && <p className="feedback-box">{feedback}</p>}
          </>
        )}

        <p className="hint">
          Press <strong>Enter</strong> or click <strong>Check Strength</strong> to evaluate.
        </p>
      </div>
    </div>
  );
}
