const KEYS = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
const NUMBERS = "1234567890".split("");
const SPECIAL = ["!", "@", "#", "$", "%", "&", "?", "*", "-", "_", "+"];

export default function Keyboard({
  onKey,
  onEnter,
  onDelete,
  disabled = false,
  keyStatuses = {}, // { a: "wrong" | "present" | "correct", ... }
}) {
  const keyClass = (k) => {
    const st = keyStatuses[k.toLowerCase()];
    return `key ${st || ""}`.trim();
  };

  return (
    <div className="keyboard">
      {/* Numbers */}
      <div className="key-row">
        {NUMBERS.map((k) => (
          <button
            key={k}
            className={keyClass(k)}
            onClick={() => onKey(k)}
            disabled={disabled}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Letters row 1 */}
      <div className="key-row">
        {KEYS.slice(0, 10).map((k) => (
          <button
            key={k}
            className={keyClass(k)}
            onClick={() => onKey(k)}
            disabled={disabled}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Letters row 2 */}
      <div className="key-row">
        {KEYS.slice(10, 19).map((k) => (
          <button
            key={k}
            className={keyClass(k)}
            onClick={() => onKey(k)}
            disabled={disabled}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Letters row 3 + controls */}
      <div className="key-row">
        <button
          className="big key"
          onClick={onEnter}
          disabled={disabled}
        >
          ENTER
        </button>

        {KEYS.slice(19).map((k) => (
          <button
            key={k}
            className={keyClass(k)}
            onClick={() => onKey(k)}
            disabled={disabled}
          >
            {k}
          </button>
        ))}

        <button
          className="big key"
          onClick={onDelete}
          disabled={disabled}
        >
          ⌫
        </button>
      </div>

      {/* Special characters */}
      <div className="key-row">
        {SPECIAL.map((k) => (
          <button
            key={k}
            className={keyClass(k)}
            onClick={() => onKey(k)}
            disabled={disabled}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
