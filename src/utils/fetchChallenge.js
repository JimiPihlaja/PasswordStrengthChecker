export async function fetchDailyChallenge() {
  const res = await fetch("http://localhost:3001/daily-challenge");
  return await res.json();
}

export async function analyzePassword(password) {
  const res = await fetch("http://localhost:3001/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return await res.json();
}
