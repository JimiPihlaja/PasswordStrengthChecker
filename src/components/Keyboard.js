const KEYS = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
const SPECIAL = ["!", "@", "#", "$", "%", "&", "?", "*", "-"];


export default function Keyboard({ onKey, onEnter, onDelete }) {
  return (
    
    
    <div className="keyboard">
      <div className="key-row">
        {KEYS.slice(0, 10).map(k => (
          <button key={k} onClick={() => onKey(k)}>{k}</button>
        ))}
      </div>
      <div className="key-row">
        {KEYS.slice(10, 19).map(k => (
          <button key={k} onClick={() => onKey(k)}>{k}</button>
        ))}
      </div>
      <div className="key-row">
        <button className="big" onClick={onEnter}>ENTER</button>
        {KEYS.slice(19).map(k => (
          <button key={k} onClick={() => onKey(k)}>{k}</button>
        ))}
        <button className="big" onClick={onDelete}>⌫</button>
      </div>
      <div className="keyboard-row">
  {SPECIAL.map(key => (
    <button key={key} onClick={() => onKey(key)}>
      {key}
    </button>
  ))}
</div>
    </div>
    
  );
}
