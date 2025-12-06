import Row from "./Row";

export default function Grid({ guesses, results, wordLength }) {
  const rows = 6;

  return (
    <div className="grid">
      {Array(rows).fill(0).map((_, i) => (
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
