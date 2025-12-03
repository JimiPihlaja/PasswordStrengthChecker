import React from "react";

function StrengthIndicator({ strength }) {
  return (
    <div className="strength-output">
      <p>Password strength: <strong>{strength}</strong></p>
    </div>
  );
}

export default StrengthIndicator;