import React, { useEffect, useMemo, useState } from "react";
import { analyzePassword } from "../utils/fetchChallenge";
import "./PasswordStrengthPanel.css";
import PasswordChecklist from "./PasswordChecklist";

const DEFAULT_TIPS = [
  "Use long passwords or passphrases (14+ characters recommended). Length is more important than complexity. (ENISA, NIST 800-63B)",
  "Prefer passphrases made of multiple words that are easy to remember but hard to guess. (ENISA)",
  "Avoid common passwords, leaked passwords, names, and predictable patterns. (NIST 800-63B)",
  "Do not reuse passwords across different services. Use a password manager to generate and store unique passwords. (ENISA, NIST)",
  "Do not change passwords regularly unless there is a breach or suspicion of compromise. (NIST 800-63B)",
  "Enable multi-factor authentication (MFA/2FA) whenever possible. (ENISA, NIST)",
];

export default function PasswordStrengthPanel({ dailyPassword, dailyAnalysis }) {
  const [daily, setDaily] = useState(dailyAnalysis || null);
  const [loadingDaily, setLoadingDaily] = useState(!dailyAnalysis);

  const [myPw, setMyPw] = useState("");
  const [myAnalysis, setMyAnalysis] = useState(null);
  const [loadingMine, setLoadingMine] = useState(false);
  const [errorMine, setErrorMine] = useState("");

  
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

      const crackTimeText = analysis.crackTimeText || "Not available";

      const tips =
        Array.isArray(analysis.tips) && analysis.tips.length > 0
          ? analysis.tips
          : DEFAULT_TIPS;

      const messages = Array.isArray(analysis.messages) ? analysis.messages : [];

      return { crackTimeText, tips, messages };
    };

    return {
      daily: normalizeOne(daily),
      mine: normalizeOne(myAnalysis),
    };
  }, [daily, myAnalysis]);

  const AnalysisBody = ({ analysis, loading }) => {
    if (loading) return <div className="psc-loading">Analyzing...</div>;
    if (!analysis) return <div className="psc-loading">No data.</div>;

    return (
      <>
        <div className="psc-row">
          <div className="psc-label">Estimated time to crack</div>
          <div className="psc-value">{analysis.crackTimeText}</div>
        </div>

        {analysis.messages.length > 0 && (
          <div className="psc-section">
            <div className="psc-section-title">What to improve</div>
            <ul className="psc-list">
              {analysis.messages.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="psc-section">
          <div className="psc-section-title">
            Password tips (based on ENISA and NIST SP 800-63B)
          </div>
          <ul className="psc-list">
            {analysis.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  return (
    <div className="psc">
      <div className="psc-hero">
        <div>
          <h1 className="psc-title">Password Strength Checker</h1>
          <p className="psc-subtitle">
            The game is over! Now let's see how strong today's password is, and you
            can test yours.
          </p>
        </div>
      </div>

    
      <div className="psc-card">
        <div className="psc-card-header">
          <h2>Daily password analysis</h2>
        </div>

        <div className="psc-row">
          <div className="psc-label">Password</div>
          <div className="psc-value psc-mono">{dailyPassword || "-"}</div>
        </div>

        <AnalysisBody analysis={normalize.daily} loading={loadingDaily} />
      </div>

    
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

        <PasswordChecklist password={myPw} />

        {errorMine && <div className="psc-error">{errorMine}</div>}

        
        {normalize.mine && (
          <>
            <div className="psc-divider" />

            <div className="psc-row">
              <div className="psc-label">Password</div>
              <div className="psc-value psc-mono">{myPw}</div>
            </div>

            <AnalysisBody analysis={normalize.mine} loading={false} />
          </>
        )}
      </div>
    </div>
  );
}
