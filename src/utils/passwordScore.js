export function calculateXP(password = "") {
  const commonPasswords = [
    "password","123456","12345678","qwerty","abc123","111111","1234567","iloveyou","admin","welcome","letmein"
  ];

  const pw = String(password);
  const length = pw.length;

  let countLower = 0;
  let countUpper = 0;
  let countDigits = 0;
  let countSymbols = 0;

  for (let ch of pw) {
    if (/[a-z]/.test(ch)) countLower++;
    else if (/[A-Z]/.test(ch)) countUpper++;
    else if (/[0-9]/.test(ch)) countDigits++;
    else countSymbols++;
  }

  // Base points
  let xp = 0;
  xp += countLower * 4;
  xp += countUpper * 6;
  xp += countDigits * 10;
  xp += countSymbols * 15;

  // length bonus (always)
  xp += length * 5;

  // length bonus
  if (length > 12) xp += 20;

  // penalty for common passwords
  const lowerPw = pw.toLowerCase();
  const isCommon = commonPasswords.some((c) => lowerPw === c || lowerPw.includes(c));
  if (isCommon) xp -= 50;

  // pattern detection
  const hasSequence = /(012|123|234|345|456|567|678|789|abc|bcd|cde|qwe|asd)/i.test(pw);
  const hasRepeat = /(.)\1\1/.test(pw); // three repeated chars
  if (!hasSequence && !hasRepeat && !isCommon && length > 3) {
    xp += 30; // bonus for avoiding trivial patterns
  }

  if (xp < 0) xp = 0;

  return Math.round(xp);
}

export function calculateLevel(xp = 0) {
  // level 1 starts at xp 0
  const level = Math.floor(xp / 100) + 1;
  return level;
}