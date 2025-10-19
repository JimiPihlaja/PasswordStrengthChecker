import React, { useState } from "react";

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hasChecked, setHasChecked] = useState(false);

  const handleChange = (e) => {
    setPassword(e.target.value);
    setHasChecked(false); // Reset each time user changes input
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

    // Estimate entropy → convert to 0–100 scale
    const entropy = pwd.length * Math.log2(pool || 1);
    const score = Math.min(Math.round((entropy / 100) * 100), 100);
    return score;
  }

  function generateFeedback(pwd, score) {
    if (!pwd) return "";
    const suggestions = [];
    if (pwd.length < 8) suggestions.push("Make it longer (12+ characters is better).");
    if (!/[A-Z]/.test(pwd)) suggestions.push("Add an uppercase letter.");
    if (!/[0-9]/.test(pwd)) suggestions.push("Include a number.");
    if (!/[^A-Za-z0-9]/.test(pwd)) suggestions.push("Add a special symbol like ! or @.");
    if (/password|1234|qwerty/i.test(pwd)) suggestions.push("Avoid common words or patterns.");

    if (suggestions.length === 0) {
      return "✅ Your password looks strong and secure!";
    }
    return suggestions.slice(0, 2).join(" ");
  }

  function getLabel(score) {
    if (score < 30) return { text: "Weak", color: "red" };
    if (score < 60) return { text: "Medium", color: "orange" };
    if (score < 85) return { text: "Strong", color: "green" };
    return { text: "Very Strong", color: "darkgreen" };
  }

  const label = getLabel(score);

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Password Strength Checker</h2>

      <input
        type="password"
        value={password}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Enter your password and press Enter..."
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "10px",
          marginBottom: "15px",
          border: "1px solid #ccc",
          borderRadius: "5px"
        }}
      />

      <button
        onClick={checkStrength}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "15px"
        }}
      >
        Check Strength
      </button>

      {hasChecked && (
        <>
          {/* Strength bar */}
          <div
            style={{
              width: "100%",
              height: "8px",
              backgroundColor: "#eee",
              borderRadius: "5px",
              overflow: "hidden",
              marginBottom: "10px"
            }}
          >
            <div
              style={{
                height: "8px",
                width: `${score}%`,
                backgroundColor: label.color,
                transition: "width 0.4s"
              }}
            ></div>
          </div>

          {/* Strength label + numeric score */}
          <p style={{ fontWeight: "bold", color: label.color }}>
            Strength: {label.text} ({score}/100)
          </p>

          {/* Feedback */}
          {feedback && (
            <p style={{ fontSize: "14px", marginTop: "8px" }}>{feedback}</p>
          )}
        </>
      )}
    </div>
  );
}
