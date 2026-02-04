import React, { useMemo } from "react";
import "./PasswordChecklist.css";

function ruleItem(ok, text) {
  return { ok: !!ok, text };
}

export default function PasswordChecklist({ password = "" }) {
  const rules = useMemo(() => {
    const pw = password || "";

    const length14 = pw.length >= 14;
    const length16 = pw.length >= 16;

    const hasLower = /[a-z]/.test(pw);
    const hasUpper = /[A-Z]/.test(pw);
    const hasNum = /[0-9]/.test(pw);
    const hasSym = /[^A-Za-z0-9]/.test(pw);

    // simple "common words" check (front-only, lightweight)
    const common = [
      "password",
      "qwerty",
      "admin",
      "letmein",
      "welcome",
      "login",
      "iloveyou",
      "monkey",
      "dragon",
      "abc123",
      "123456",
    ];
    const containsCommon = common.some((w) => pw.toLowerCase().includes(w));

    // simple sequence / repeats checks
    const hasRepeat4 = /(.)\1\1\1/.test(pw); // aaaa / 1111
    const hasDigitsSeq =
      /0123|1234|2345|3456|4567|5678|6789|7890/.test(pw);
    const hasAlphaSeq =
      /abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz/i.test(
        pw
      );

    return [
      ruleItem(length14, "At least 14 characters (recommended)"),
      ruleItem(length16, "16+ characters (very strong length)"),
      ruleItem(hasLower, "Has a lowercase letter (a–z)"),
      ruleItem(hasUpper, "Has an uppercase letter (A–Z)"),
      ruleItem(hasNum, "Has a number (0–9)"),
      ruleItem(hasSym, "Has a symbol (e.g. !@#$)"),
      ruleItem(!containsCommon, "Does not contain common words (password, qwerty…)"),
      ruleItem(!hasRepeat4, "Avoids repeated characters (aaaa / 1111)"),
      ruleItem(!(hasDigitsSeq || hasAlphaSeq), "Avoids simple sequences (1234 / abcd)"),
    ];
  }, [password]);

  return (
    <div className="pcl">
      <div className="pcl-title">Live checklist</div>
      <ul className="pcl-list">
        {rules.map((r, i) => (
          <li key={i} className={`pcl-item ${r.ok ? "ok" : "bad"}`}>
            <span className="pcl-dot" aria-hidden="true">
              {r.ok ? "✓" : "•"}
            </span>
            <span>{r.text}</span>
          </li>
        ))}
      </ul>
      <div className="pcl-note">
        Checklist is a quick guide. Final result uses the password analyzer.
      </div>
    </div>
  );
}
