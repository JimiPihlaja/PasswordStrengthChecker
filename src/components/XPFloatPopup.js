import React, { useEffect, useState } from "react";
import "./XPFloatPopup.css";

function XPFloatPopup({ amount }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!amount) return;
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 800); // popup kestää 0.8 sek

    return () => clearTimeout(timer);
  }, [amount]);

  if (!visible) return null;

  return (
    <div className="xp-float-popup">
      +{amount} XP
    </div>
  );
}

export default XPFloatPopup;