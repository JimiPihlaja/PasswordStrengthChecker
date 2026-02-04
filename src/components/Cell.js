export default function Cell({ value = "", status }) {
  const className = status ? `cell ${status}` : "cell";

  return <div className={className}>{value}</div>;
}
