export default function ResultPopup({ visible, success, correctWord, score }) {
  if (!visible) return null;

  return (
    <div className="popup">
      <h2>{success ? "You cracked it! " : "Failed"}</h2>
      <p>Correct word was: <b>{correctWord}</b></p>
    </div>
  );
}
