export function normalizePronunciation(value: string) {
  return value.toLocaleLowerCase("en").replace(/[’‘]/g, "'").replace(/[^a-z0-9'\s]/g, " ").replace(/\s+/g, " ").trim();
}
export function pronunciationResult(expected: string, heard: string) {
  const expectedWords = normalizePronunciation(expected).split(" ").filter(Boolean);
  const heardWords = normalizePronunciation(heard).split(" ").filter(Boolean);
  const matrix = Array.from({ length: expectedWords.length + 1 }, () => Array(heardWords.length + 1).fill(0));
  for (let i = 0; i <= expectedWords.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= heardWords.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= expectedWords.length; i += 1) for (let j = 1; j <= heardWords.length; j += 1) {
    matrix[i][j] = expectedWords[i - 1] === heardWords[j - 1] ? matrix[i - 1][j - 1] : 1 + Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]);
  }
  const distance = matrix[expectedWords.length][heardWords.length];
  const score = expectedWords.length ? Math.max(0, Math.round((1 - distance / Math.max(expectedWords.length, heardWords.length, 1)) * 100)) : 0;
  const heardSet = new Set(heardWords);
  return { score, missing: expectedWords.filter((word, index) => !heardSet.has(word) && expectedWords.indexOf(word) === index) };
}
