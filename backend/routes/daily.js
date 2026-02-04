const express = require("express");
const router = express.Router();

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick(arr, seed) {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

function titleCase4(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// 2-kirjaimen "alkuja" (lausuttavia)
const START = [
  "ba","be","bi","bo","bu","by",
  "ca","ce","ci","co","cu","cy",
  "da","de","di","do","du","dy",
  "fa","fe","fi","fo","fu","fy",
  "ga","ge","gi","go","gu","gy",
  "ha","he","hi","ho","hu",
  "ja","je","ji","jo","ju",
  "ka","ke","ki","ko","ku",
  "la","le","li","lo","lu",
  "ma","me","mi","mo","mu",
  "na","ne","ni","no","nu",
  "pa","pe","pi","po","pu",
  "ra","re","ri","ro","ru",
  "sa","se","si","so","su",
  "ta","te","ti","to","tu",
  "va","ve","vi","vo","vu",
  "wa","we","wi","wo","wu",
  "za","ze","zi","zo","zu",
  // extra “bitwarden-fiilis”: vähän vaihtelevampia alkuja
  "br","cr","dr","fr","gr","pr","tr",
  "ch","sh","th","wh",
  "st","sp","sk","sl","sm","sn","sw",
];

// 2-kirjaimen "loppuja" (lausuttavia, mutta ei liian “sanakirja”)
const END = [
  "ck","ft","ld","lk","lm","ln","lp","lt",
  "mp","nd","ng","nk","nt","pt",
  "rd","rf","rk","rm","rn","rs","rt",
  "sh","sk","sp","st","th",
  "ff","gg","kk","ll","mm","nn","pp","rr","ss","tt",
  // vokaaliloppuja, tekee helpommin muistettavia
  "al","el","il","ol","ul",
  "an","en","in","on","un",
  "ar","er","ir","or","ur",
  "as","es","is","os","us",
  "am","em","im","om","um",
  "ay","ey","iy","oy","uy",
];

// Tee 4 kirjainta: 2+2 (lausuttava)
function makeChunk4(seedBase, offset) {
  const left = pick(START, seedBase + offset * 101 + 1);
  const right = pick(END, seedBase + offset * 101 + 2);
  const raw = (left + right).slice(0, 4);
  return titleCase4(raw);
}

function generateDailyChallenge() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const date = `${y}-${m}-${d}`;

  const seed = Number(`${y}${m}${d}`);

  // 4-4-4 + kaksi "-" = 14 merkkiä
  let a = makeChunk4(seed, 1);
  let b = makeChunk4(seed, 2);
  let c = makeChunk4(seed, 3);

  // varmista eri osat (deterministisesti)
  if (b === a) b = makeChunk4(seed, 20);
  if (c === a || c === b) c = makeChunk4(seed, 21);

  const pw = `${a}-${b}-${c}`; // aina 14

  return {
    id: seed,
    word: pw,
    hint: "Daily passphrase: Xxxx-Xxxx-Xxxx (14 chars, pronounceable).",
    date,
  };
}

router.get("/", (req, res) => {
  res.json(generateDailyChallenge());
});

module.exports = router;
