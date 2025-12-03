import React from "react";

function PasswordInput({ password, onPasswordChange }) {
  return (
    <input
      type="password"
      placeholder="Enter a password"
      value={password}
      onChange={(e) => onPasswordChange(e.target.value)}
      className="password-input"
    />
  );
}

export default PasswordInput;
