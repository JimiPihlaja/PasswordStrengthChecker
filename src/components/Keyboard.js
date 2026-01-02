const KEYS = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
const NUMBERS = "1234567890".split("");
const SPECIAL = ["!", "@", "#", "$", "%", "&", "?", "*", "-", "_", "+"];

export default function Keyboard({ onKey, onEnter, onDelete, disabled = false }) {
  return (
    <div className="keyboard">
      <div className="key-row">
        {NUMBERS.map((k) => (
          <button key={k} onClick={() => onKey(k)} disabled={disabled}>
            {k}
          </button>
        ))}
      </div>

      <div className="key-row">
        {KEYS.slice(0, 10).map((k) => (
          <button key={k} onClick={() => onKey(k)} disabled={disabled}>
            {k}
          </button>
        ))}
      </div>

      <div className="key-row">
        {KEYS.slice(10, 19).map((k) => (
          <button key={k} onClick={() => onKey(k)} disabled={disabled}>
            {k}
          </button>
        ))}
      </div>

      <div className="key-row">
        <button className="big" onClick={onEnter} disabled={disabled}>
          ENTER
        </button>

        {KEYS.slice(19).map((k) => (
          <button key={k} onClick={() => onKey(k)} disabled={disabled}>
            {k}
          </button>
        ))}

        <button className="big" onClick={onDelete} disabled={disabled}>
          ⌫
        </button>
      </div>

      <div className="key-row">
        {SPECIAL.map((k) => (
          <button key={k} onClick={() => onKey(k)} disabled={disabled}>
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
