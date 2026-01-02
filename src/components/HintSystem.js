import React, { useMemo, useState } from "react";
import "./HintSystem.css";

export default function HintSystem({ hints = [] }) {
  const [open, setOpen] = useState(true);

  const normalized = useMemo(() => {
    // Poista tyhjät + dedup
    const clean = (hints || []).filter(Boolean).map(String);
    return Array.from(new Set(clean));
  }, [hints]);

  const hasHints = normalized.length > 0;

  return (
    <aside className="hints" aria-label="Hints panel">
      <button
        className="hints-header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        type="button"
      >
        <div className="hints-header-left">
          <span className="hints-badge">{hasHints ? normalized.length : 0}</span>
          <span className="hints-title">Vihjeet</span>
        </div>
        <span className="hints-chevron">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="hints-body">
          {!hasHints ? (
            <div className="hints-empty">
              Ei vihjeitä vielä. Tee arvaus!
            </div>
          ) : (
            <ul className="hints-list">
              {normalized.map((hint, i) => (
                <li key={`${hint}-${i}`} className="hints-item">
                  {hint}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </aside>
  );
}
