import Cell from "./Cell";

export default function Row({ guess, result, length }) {
  const letters = guess.split("").concat(Array(length - guess.length).fill(""));

  return (
    <div className="row">
      {letters.map((char, i) => (
        <Cell key={i} value={char} status={result?.[i]} />
      ))}
    </div>
  );
}
