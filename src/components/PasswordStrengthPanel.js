import React, { useEffect, useMemo, useState } from "react";
import { analyzePassword } from "../utils/fetchChallenge";
import "./PasswordStrengthPanel.css";

function pillClass(label) {
  return `psc-${String(label || "very weak")
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
}

const DEFAULT_TIPS = [
  "Use 12–16+ characters. Length matters more than complexity.",
  "Avoid common words, names, and keyboard patterns (qwerty, 123456).",
  "Avoid reusing passwords — use a password manager if possible.",
  "Enable two-factor authentication (2FA) for important accounts.",
];

export default function PasswordStrengthPanel({ dailyPassword, dailyAnalysis }) {
  const [daily, setDaily] = useState(dailyAnalysis || null);
  const [loadingDaily, setLoadingDaily] = useState(!dailyAnalysis);

  const [myPw, setMyPw] = useState("");
  const [myAnalysis, setMyAnalysis] = useState(null);
  const [loadingMine, setLoadingMine] = useState(false);
  const [errorMine, setErrorMine] = useState("");

  // Fetch daily analysis here if App didn't pass it
  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!dailyPassword) return;
      if (dailyAnalysis) return;

      setLoadingDaily(true);
      try {
        const res = await analyzePassword(dailyPassword);
        if (mounted) setDaily(res);
      } catch {
        if (mounted) {
          setDaily({
            strengthLabel: "Very weak",
            crackTimeText: "Not available (server error).",
            messages: ["Could not analyze daily password (server error)."],
            tips: DEFAULT_TIPS,
          });
        }
      } finally {
        if (mounted) setLoadingDaily(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [dailyPassword, dailyAnalysis]);

  // Keep in sync if prop updates
  useEffect(() => {
    if (dailyAnalysis) {
      setDaily(dailyAnalysis);
      setLoadingDaily(false);
    }
  }, [dailyAnalysis]);

  const handleAnalyzeMine = async () => {
    setErrorMine("");
    setMyAnalysis(null);

    if (!myPw) {
      setErrorMine("Kirjoita salasana ensin.");
      return;
    }

    setLoadingMine(true);
    try {
      const res = await analyzePassword(myPw);
      setMyAnalysis(res);
    } catch {
      setErrorMine("Analyysi epäonnistui (server error).");
    } finally {
      setLoadingMine(false);
    }
  };

  const normalize = useMemo(() => {
    const normalizeOne = (analysis) => {
      if (!analysis) return null;

      const strengthLabel = analysis.strengthLabel || "Very weak";
      const crackTimeText = analysis.crackTimeText || "Not available";

      const tips =
        Array.isArray(analysis.tips) && analysis.tips.length > 0
          ? analysis.tips
          : DEFAULT_TIPS;

      const messages = Array.isArray(analysis.messages) ? analysis.messages : [];

      return { strengthLabel, crackTimeText, tips, messages };
    };

    return {
      daily: normalizeOne(daily),
      mine: normalizeOne(myAnalysis),
    };
  }, [daily, myAnalysis]);

  const renderAnalysisCard = (title, pw, analysis, loading) => {
    const a = analysis || null;

    return (
      <div className="psc-card">
        <div className="psc-card-header">
          <h2>{title}</h2>
        </div>

        <div className="psc-row">
          <div className="psc-label">Password</div>
          <div className="psc-value psc-mono">{pw || "-"}</div>
        </div>

        {loading ? (
          <div className="psc-loading">Analyzing...</div>
        ) : a ? (
          <>
            <div className="psc-row">
              <div className="psc-label">Strength</div>
              <div className="psc-value">
                <span className={`psc-pill ${pillClass(a.strengthLabel)}`}>
                  {a.strengthLabel}
                </span>
              </div>
            </div>

            <div className="psc-row">
              <div className="psc-label">Estimated time to crack</div>
              <div className="psc-value">{a.crackTimeText}</div>
            </div>
           
           
            {a.messages.length > 0 && (
              <div className="psc-section">
                <div className="psc-section-title">What to improve</div>
                <ul className="psc-list">
                  {a.messages.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="psc-section">
              <div className="psc-section-title">Password tips</div>
              <ul className="psc-list">
                {a.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="psc-loading">Ei dataa.</div>
        )}
      </div>
    );
  };

  return (
    <div className="psc">
      <h1 className="psc-title">Password Strength Checker</h1>
      <p className="psc-subtitle">
        Peli päättyi — nyt katsotaan kuinka vahva päivän salasana oikeasti on,
        ja voit testata omiasi.
      </p>

      {renderAnalysisCard(
        "Daily password analysis",
        dailyPassword,
        normalize.daily,
        loadingDaily
      )}

      <div className="psc-card">
        <div className="psc-card-header">
          <h2>Test your own password</h2>
        </div>

        <div className="psc-input-row">
          <input
            className="psc-input"
            placeholder="Type a password to analyze..."
            value={myPw}
            onChange={(e) => setMyPw(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAnalyzeMine();
            }}
          />
          <button
            className="psc-btn"
            onClick={handleAnalyzeMine}
            disabled={loadingMine}
          >
            {loadingMine ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {errorMine && <div className="psc-error">{errorMine}</div>}

        {normalize.mine && <div className="psc-divider" />}

        {normalize.mine &&
          renderAnalysisCard("Your password result", myPw, normalize.mine, false)}
      </div>
    </div>
  );
}
