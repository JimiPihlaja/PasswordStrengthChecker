import Cell from "./Cell";

export default function Row({ guess = "", result = null, length = 14 }) {
  const safeLength = Math.max(length, 0);
  const chars = guess.slice(0, safeLength).split("");

  const letters = chars.concat(
    Array(Math.max(safeLength - chars.length, 0)).fill("")
  );

  return (
    <div className="row">
      {letters.map((char, i) => (
        <Cell
          key={i}
          value={char.toUpperCase()}
          status={result ? result[i] : null}
        />
      ))}
    </div>
  );
}
