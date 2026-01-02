import Row from "./Row";

export default function Grid({ guesses = [], results = [], wordLength = 14, rows = 6 }) {
  return (
    <div className="grid">
      {Array.from({ length: rows }).map((_, i) => (
        <Row
          key={i}
          guess={guesses[i] || ""}
          result={results[i] || null}
          length={wordLength}
        />
      ))}
    </div>
  );
}
