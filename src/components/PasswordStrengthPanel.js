import React, { useEffect, useState } from "react";
import { analyzePassword } from "../utils/fetchChallenge";
import "./PasswordStrengthPanel.css";

export default function PasswordStrengthPanel({ dailyPassword, dailyAnalysis }) {
  const [daily, setDaily] = useState(dailyAnalysis || null);
  const [loadingDaily, setLoadingDaily] = useState(!dailyAnalysis);

  const [myPw, setMyPw] = useState("");
  const [myAnalysis, setMyAnalysis] = useState(null);
  const [loadingMine, setLoadingMine] = useState(false);
  const [errorMine, setErrorMine] = useState("");

  // If App didn't pass analysis for some reason, fetch it here
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
            score: 0,
            strengthLabel: "Unknown",
            crackTimeText: "Could not calculate (server error).",
            messages: ["Could not analyze daily password (server error)."],
            tips: [],
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

  // keep in sync if prop updates
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

  const renderAnalysisCard = (title, pw, analysis, loading) => (
    <div className="psc-card">
      <div className="psc-card-header">
        <h2>{title}</h2>
      </div>

      <div className="psc-row">
        <div className="psc-label">Password</div>
        <div className="psc-value psc-mono">{pw || "-"}</div>
      </div>

      {loading ? (
        <div className="psc-loading">Analysoidaan...</div>
      ) : analysis ? (
        <>
          <div className="psc-row">
            <div className="psc-label">Strength</div>
            <div className="psc-value">
              <span className={`psc-pill psc-${(analysis.strengthLabel || "unknown").toLowerCase().replace(/\s+/g, "-")}`}>
                {analysis.strengthLabel || "Unknown"}
              </span>
              <span className="psc-score">Score: {typeof analysis.score === "number" ? analysis.score : 0}/100</span>
            </div>
          </div>

          <div className="psc-row">
            <div className="psc-label">Estimated crack time</div>
            <div className="psc-value">{analysis.crackTimeText || "—"}</div>
          </div>

          {!!analysis.entropyBits && (
            <div className="psc-row">
              <div className="psc-label">Entropy (rough)</div>
              <div className="psc-value">{analysis.entropyBits} bits</div>
            </div>
          )}

          {Array.isArray(analysis.messages) && analysis.messages.length > 0 && (
            <div className="psc-section">
              <div className="psc-section-title">What to improve</div>
              <ul className="psc-list">
                {analysis.messages.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(analysis.tips) && analysis.tips.length > 0 && (
            <div className="psc-section">
              <div className="psc-section-title">Password tips</div>
              <ul className="psc-list">
                {analysis.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="psc-loading">Ei dataa.</div>
      )}
    </div>
  );

  return (
    <div className="psc">
      <h1 className="psc-title">Password Strength Checker</h1>
      <p className="psc-subtitle">
        Peli päättyi — nyt katsotaan kuinka vahva päivän salasana oikeasti on, ja voit testata omiasi.
      </p>

      {/* Daily password analysis */}
      {renderAnalysisCard(
        "Daily password analysis",
        dailyPassword,
        daily,
        loadingDaily
      )}

      {/* User test */}
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
          <button className="psc-btn" onClick={handleAnalyzeMine} disabled={loadingMine}>
            {loadingMine ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {errorMine && <div className="psc-error">{errorMine}</div>}

        {myAnalysis && (
          <div className="psc-divider" />
        )}

        {myAnalysis &&
          renderAnalysisCard("Your password result", myPw, myAnalysis, false)}
      </div>
    </div>
  );
}
