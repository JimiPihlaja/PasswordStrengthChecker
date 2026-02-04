const express = require("express");
const cors = require("cors");
const zxcvbn = require("zxcvbn");

const app = express();
app.use(cors());
app.use(express.json());


const dailyRouter = require("./routes/daily");
app.use("/daily-challenge", dailyRouter);


app.get("/health", (req, res) => res.json({ ok: true }));


// (ZXCVBN)

app.post("/analyze", (req, res) => {
  const { password } = req.body;

  if (typeof password !== "string") {
    return res.status(400).json({ error: "password must be a string" });
  }

  const pw = password;
   const messages = [];

  // zxcvbn analysis
  const zx = zxcvbn(pw);

  // Crack time

  const crackTimeText =
  zx?.crack_times_display?.offline_slow_hashing_1e4_per_second ||
  zx?.crack_times_display?.online_no_throttling_10_per_second ||
  zx?.crack_times_display?.offline_fast_hashing_1e10_per_second ||
  "Not available";


  
  if (pw.length < 8) {
    messages.push("Password is too short — aim for at least 14 characterss.");
  } else if (pw.length < 14) {
    messages.push("Password is acceptable but short — 14+ characters are recommended.");
  }

  
  const warning = zx?.feedback?.warning;
  const suggestions = zx?.feedback?.suggestions || [];

  if (warning) messages.push(warning);
  for (const s of suggestions) messages.push(s);

  
  const tips = [
    "Use long passwords or passphrases (14+ characters recommended). Length is more important than complexity.",
    "Prefer passphrases made of multiple words that are easy to remember but hard to guess.",
    "Avoid common passwords, leaked passwords, names, and predictable patterns.",
    "Do not reuse passwords across different services. Use a password manager to generate and store unique passwords.",
    "Do not change passwords regularly unless there is a breach or suspicion of compromise.",
    "Enable multi-factor authentication (MFA/2FA) whenever possible.",
  ];

  
  res.json({
    crackTimeText,
    messages,
    tips,


    debug: {
      zxcvbnScore: zx.score, // 0–4
      guessesLog10: zx.guesses_log10,
      scenario: "offline_fast_hashing_1e10_per_second",
    },
  });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
