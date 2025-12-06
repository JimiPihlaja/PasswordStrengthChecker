export default function Cell({ value, status }) {
  return (
    <div className={`cell ${status}`}>
      {value}
    </div>
  );
}
