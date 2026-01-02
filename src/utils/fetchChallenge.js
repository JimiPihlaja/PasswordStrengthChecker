const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

async function safeJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { error: "Invalid JSON response from server." };
  }
}

export async function fetchDailyChallenge() {
  const res = await fetch(`${API_BASE}/daily-challenge`);
  const data = await safeJson(res);

  if (!res.ok) {
    throw new Error(data?.error || "Failed to fetch daily challenge.");
  }
  return data;
}

export async function analyzePassword(password) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  const data = await safeJson(res);

  if (!res.ok) {
    throw new Error(data?.error || "Failed to analyze password.");
  }

  return {
    score: typeof data?.score === "number" ? data.score : 0,
    strengthLabel: data?.strengthLabel || "Unknown",
    crackTimeText: data?.crackTimeText || "—",
    entropyBits: typeof data?.entropyBits === "number" ? data.entropyBits : null,
    messages: Array.isArray(data?.messages) ? data.messages : [],
    tips: Array.isArray(data?.tips) ? data.tips : [],
  };
}

